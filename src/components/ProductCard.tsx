'use client';

import { Product } from '@/lib/api';
import { Box, Image, Text, VStack, Button, HStack } from '@chakra-ui/react';
import { CDN_BASE_URL, FALLBACK_IMAGE } from '@/lib/config';
import { useCart } from '@/contexts/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Get the product image or fallback
  const imageUrl = product.images?.image_path
    ? `${CDN_BASE_URL}/${product.images.image_path}`
    : FALLBACK_IMAGE;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        bg="white"
        shadow="sm"
        _hover={{ shadow: "md", transform: "translateY(-2px)" }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Image
          src={imageUrl}
          alt={product.product_name}
          w="full"
          h="200px"
          objectFit="cover"
          borderRadius="md"
          mb={3}
        />
        <VStack align="start" spacing={2}>
          <Text fontSize="md" fontWeight="semibold" noOfLines={2} minH="40px">
            {product.product_name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {product.product_code}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="blue.600">
            Rp {(product.selling_price || 0).toLocaleString('id-ID')}
          </Text>
          <Button
            leftIcon={<FiShoppingCart />}
            colorScheme="blue"
            size="sm"
            w="full"
            onClick={handleAddToCart}
          >
            Tambah ke Keranjang
          </Button>
        </VStack>
      </Box>
    </Link>
  );
}
