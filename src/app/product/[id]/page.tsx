'use client';

import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  Spinner,
  Center,
  IconButton,
  Flex,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FiShoppingCart, FiMinus, FiPlus, FiExternalLink } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/api';
import { CDN_BASE_URL, FALLBACK_IMAGE } from '@/lib/config';
import RelatedProducts from '@/components/RelatedProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const toast = useToast();
  const { data: productResponse, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      console.log('Product detail response:', data);
      return data;
    },
  });

  // Handle different response structures
  const product = productResponse?.data || productResponse;

  if (isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !product) {
    return (
      <Center h="400px">
        <Text color="red.500">Produk tidak ditemukan</Text>
      </Center>
    );
  }

  // Safely access nested properties
  const categoryName = product.category?.category_name || 'Kategori tidak tersedia';
  const brandName = product.brand?.brand_name || 'Brand tidak tersedia';

  const imageUrl = product.images?.image_path
    ? `${CDN_BASE_URL}/${product.images.image_path}`
    : FALLBACK_IMAGE;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast({
      title: 'Produk ditambahkan ke keranjang',
      description: `${quantity} ${product.product_name} berhasil ditambahkan`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const tokopediaUrl = `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(product.product_name)}`;

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={12}>
        <GridItem>
          <Image
            src={imageUrl}
            alt={product.product_name}
            w="full"
            h={{ base: '400px', lg: '500px' }}
            objectFit="cover"
            borderRadius="lg"
            shadow="md"
          />
        </GridItem>
        
        <GridItem>
          <VStack align="start" spacing={6} h="full">            <VStack align="start" spacing={3}>
              <Badge colorScheme="blue" fontSize="sm">
                {categoryName}
              </Badge>
              <Text fontSize="3xl" fontWeight="bold" lineHeight="shorter">
                {product.product_name}
              </Text>
              <Text fontSize="lg" color="gray.600">
                Kode: {product.product_code}
              </Text>
              <Text fontSize="lg" color="gray.600">
                Brand: {brandName}
              </Text>
            </VStack>

            <Divider />

            <VStack align="start" spacing={4} flex={1}>
              <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                Rp {product.selling_price.toLocaleString('id-ID')}
              </Text>

              {product.description && (
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Deskripsi
                  </Text>
                  <Text color="gray.700" lineHeight="tall">
                    {product.description}
                  </Text>
                </Box>
              )}

              <Box w="full">
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  Jumlah
                </Text>
                <HStack>
                  <IconButton
                    aria-label="Decrease quantity"
                    icon={<FiMinus />}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={quantity <= 1}
                  />
                  <Text fontSize="xl" fontWeight="bold" minW="60px" textAlign="center">
                    {quantity}
                  </Text>
                  <IconButton
                    aria-label="Increase quantity"
                    icon={<FiPlus />}
                    onClick={() => setQuantity(quantity + 1)}
                  />
                </HStack>
              </Box>

              <VStack w="full" spacing={3}>
                <Button
                  leftIcon={<FiShoppingCart />}
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  onClick={handleAddToCart}
                >
                  Tambah ke Keranjang
                </Button>
                
                <ChakraLink href={tokopediaUrl} isExternal w="full">
                  <Button
                    leftIcon={<FiExternalLink />}
                    colorScheme="green"
                    variant="outline"
                    size="lg"
                    w="full"
                  >
                    Beli di Tokopedia
                  </Button>
                </ChakraLink>
              </VStack>
            </VStack>
          </VStack>
        </GridItem>
      </Grid>

      <Divider mb={8} />
        <RelatedProducts 
        categoryId={product.category?.id || 1} 
        currentProductId={product.id}
        priceRange={[product.selling_price * 0.7, product.selling_price * 1.3]}
      />
    </Container>
  );
}
