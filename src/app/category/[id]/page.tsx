'use client';

import { useParams } from 'next/navigation';
import { Box, Container, Grid, Heading, Spinner, Text, Center } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../../../components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryProducts', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/category/${id}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">Error loading products</Text>
      </Center>
    );
  }

  const categoryName = data?.data?.[0]?.category?.category_name || 'Unknown Category';

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Category: {categoryName}</Heading>
      {data?.data?.length === 0 ? (
        <Center h="200px">
          <Text>No products found in this category</Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {data?.data?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      )}
    </Container>
  );
}
