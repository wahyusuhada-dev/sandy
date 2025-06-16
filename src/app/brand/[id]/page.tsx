'use client';

import {
  Box,
  Container,
  Grid,
  Heading,
  Spinner,
  Text,
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api';
import Link from 'next/link';

interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Brand {
  id: number;
  brand_name: string;
}

export default function BrandPage() {
  const params = useParams();
  const brandId = params.id as string;
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch products by brand with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<ProductResponse>({
    queryKey: ['brand-products', brandId],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[Brand Query] Fetching page:', pageParam);
      const response = await fetch(`/api/products/brand/${brandId}?page=${pageParam}&per_page=15`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch brand products: ${response.status}`);
      }
      const data = await response.json();
      console.log('[Brand Query] API Response:', {
        page: data.current_page,
        total: data.total,
        items: data.data?.length,
        lastPage: data.last_page
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.length) {
        return undefined;
      }
      const nextPage = lastPage.current_page < lastPage.last_page 
        ? lastPage.current_page + 1 
        : undefined;
      return nextPage;
    },
    initialPageParam: 1
  });

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '200px',
    });

    observer.observe(element);
    return () => element && observer.unobserve(element);
  }, [handleIntersection]);

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="400px">
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (error instanceof Error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="400px">
          <Text color="red.500">{error.message}</Text>
        </Center>
      </Container>
    );
  }

  // Combine all products from all pages
  const allProducts = data?.pages.flatMap(page => page.data) ?? [];
  const uniqueProducts = [...new Map(allProducts.map(product => [product.id, product])).values()];
  
  // Get brand name from first product
  const brandName = uniqueProducts[0]?.brand?.brand_name || `Brand ${brandId}`;

  return (
    <Container maxW="container.xl" py={8}>
      {/* Breadcrumb */}
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            {brandName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Page Title */}
      <Heading size="lg" mb={8}>
        Produk {brandName}
      </Heading>

      {uniqueProducts.length === 0 && !isLoading ? (
        <Center h="300px">
          <Text color="gray.500" fontSize="lg">
            Tidak ada produk ditemukan untuk brand ini.
          </Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {uniqueProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}
      
      {/* Loading indicator */}
      {isFetchingNextPage && (
        <Center py={4}>
          <Spinner />
        </Center>
      )}

      {/* Intersection Observer target */}
      <div 
        ref={observerTarget} 
        style={{ height: '20px', margin: '20px 0' }}
        data-testid="intersection-observer-target"
      />
    </Container>
  );
}
