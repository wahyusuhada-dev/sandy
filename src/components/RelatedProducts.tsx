'use client';

import { Box, Heading, Text, Center, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '@/lib/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
  priceRange: [number, number];
}

interface ProductResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

function RelatedProducts({ 
  categoryId, 
  currentProductId, 
  priceRange 
}: RelatedProductsProps) {
  const [minPrice, maxPrice] = priceRange;

  const { data, isLoading, error } = useQuery<ProductResponse>({
    queryKey: ['related-products', categoryId, currentProductId],
    queryFn: async () => {
      const response = await fetch(`/api/products/category/${categoryId}?page=1&per_page=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Produk Terkait</Heading>
        <Center h="200px">
          <Spinner size="lg" />
        </Center>
      </Box>
    );
  }

  if (error || !data?.data) {
    return null;
  }

  // Filter products by price range and exclude current product
  const relatedProducts = data.data
    .filter(product => 
      product.id !== currentProductId &&
      product.selling_price >= minPrice &&
      product.selling_price <= maxPrice
    )
    .slice(0, 10); // Limit to 10 products

  if (relatedProducts.length === 0) {
    return (
      <Box>
        <Heading size="lg" mb={6}>Produk Terkait</Heading>
        <Text color="gray.500" textAlign="center">
          Tidak ada produk terkait ditemukan
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Produk Terkait</Heading>
      <Box
        sx={{
          '.swiper-button-next, .swiper-button-prev': {
            color: '#3182CE',
            '&:after': {
              fontSize: '20px',
              fontWeight: 'bold',
            },
          },
          '.swiper-pagination-bullet': {
            backgroundColor: '#3182CE',
          },
          '.swiper-pagination-bullet-active': {
            backgroundColor: '#2C5282',
          },
        }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
        >
          {relatedProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}        </Swiper>
      </Box>
    </Box>
  );
}

export default RelatedProducts;
