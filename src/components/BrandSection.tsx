'use client';

import {
  Box,
  Container,
  Heading,
  Grid,
  Image,
  Text,
  VStack,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CDN_BASE_URL } from '@/lib/config';

interface Brand {
  id: number;
  brand_name: string;
  logo?: string;
}

interface BrandResponse {
  data: Brand[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function BrandSection() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  const { data, isLoading, error } = useQuery<BrandResponse>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await fetch('/api/brands');
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Box bg={bgColor} py={12}>
        <Container maxW="container.xl">
          <Heading size="lg" textAlign="center" mb={8}>
            Brand Terpercaya
          </Heading>
          <Center h="200px">
            <Spinner size="lg" />
          </Center>
        </Container>
      </Box>
    );
  }

  if (error || !data?.data) {
    return null;
  }

  // Get first 8 brands for display
  const brands = data.data.slice(0, 8);

  return (
    <Box bg={bgColor} py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Heading 
            size="lg" 
            textAlign="center"
            color="gray.700"
          >
            Brand Terpercaya
          </Heading>
          
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(8, 1fr)',
            }}
            gap={6}
            w="full"
          >
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                style={{ textDecoration: 'none' }}
              >
                <VStack
                  p={6}
                  bg={cardBg}
                  borderRadius="lg"
                  shadow="sm"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    shadow: 'md',
                    transform: 'translateY(-2px)',
                    bg: hoverBg,
                  }}
                  height="120px"
                  justify="center"
                >
                  {/* Brand Logo - using placeholder for now since we don't have logo URLs */}
                  <Box
                    w="60px"
                    h="60px"
                    bg="gray.200"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="2xl"
                    fontWeight="bold"
                    color="gray.600"
                  >
                    {brand.brand_name.charAt(0)}
                  </Box>
                  
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    textAlign="center"
                    noOfLines={1}
                    color="gray.700"
                  >
                    {brand.brand_name}
                  </Text>
                </VStack>
              </Link>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
