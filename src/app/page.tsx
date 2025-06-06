'use client';

import { Box, Container, Grid, Heading, Spinner, Text, Center } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api';
import { useEffect, useRef, useCallback } from 'react';

interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function Home() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<ProductResponse>({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[Query] Fetching page:', pageParam);
      const response = await fetch(`/api/products?page=${pageParam}&per_page=15`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      console.log('[Query] API Response:', {
        page: data.current_page,
        total: data.total,
        items: data.data?.length,
        lastPage: data.last_page
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Enhanced debug logging
      console.log('[Pagination] Processing page:', {
        currentPage: lastPage?.current_page,
        lastPage: lastPage?.last_page,
        itemsInPage: lastPage?.data?.length,
        hasMore: lastPage?.current_page < lastPage?.last_page
      });
      
      if (!lastPage?.data?.length) {
        console.log('[Pagination] No items in page');
        return undefined;
      }

      const nextPage = lastPage.current_page < lastPage.last_page 
        ? lastPage.current_page + 1 
        : undefined;

      console.log('[Pagination] Next page will be:', nextPage);
      return nextPage;
    },
    initialPageParam: 1
  });

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    console.log('[Observer] Intersection:', {
      isIntersecting: entry.isIntersecting,
      hasNextPage,
      isFetchingNextPage
    });
    
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      console.log('[Observer] Loading next page...');
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '200px', // Increased margin to load earlier
    });

    observer.observe(element);
    console.log('[Observer] Observer set up');

    return () => {
      if (element) {
        observer.unobserve(element);
        console.log('[Observer] Observer cleaned up');
      }
    };
  }, [handleIntersection]);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error instanceof Error) {
    return (
      <Center h="200px">
        <Text color="red.500">{error.message}</Text>
      </Center>
    );
  }

  // Combine all products from all pages
  const allProducts = data?.pages.flatMap(page => page.data) ?? [];
  const uniqueProducts = [...new Map(allProducts.map(product => [product.id, product])).values()];

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {uniqueProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
      
      {/* Loading indicator */}
      {isFetchingNextPage && (
        <Center py={4}>
          <Spinner />
        </Center>
      )}

      {/* Debug info */}
      <Box mt={4} p={4} bg="gray.50" borderRadius="md" fontSize="sm" color="gray.600">
        <Text>Total Products: {uniqueProducts.length}</Text>
        <Text>Pages Loaded: {data?.pages.length}</Text>
        <Text>Has More: {hasNextPage ? 'Yes' : 'No'}</Text>
        <Text>Currently Loading: {isFetchingNextPage ? 'Yes' : 'No'}</Text>
        {data?.pages[0] && (
          <>
            <Text>Current Page: {data.pages[data.pages.length - 1].current_page}</Text>
            <Text>Last Page: {data.pages[0].last_page}</Text>
          </>
        )}
      </Box>

      {/* Intersection Observer target */}
      <div 
        ref={observerTarget} 
        style={{ height: '20px', margin: '20px 0' }}
        data-testid="intersection-observer-target"
      />
    </Container>
  );
}
