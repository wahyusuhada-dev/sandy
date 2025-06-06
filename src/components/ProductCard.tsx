import { Product } from '@/lib/api';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { CDN_BASE_URL, FALLBACK_IMAGE } from '@/lib/config';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the product image or fallback
  const imageUrl = product.images?.image_path
    ? `${CDN_BASE_URL}/${product.images.image_path}`
    : FALLBACK_IMAGE;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={imageUrl}
        alt={product.product_name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.product_name}</h3>
      <p className="text-gray-700 mb-2">{product.product_code}</p>
      <p className="text-xl font-bold text-blue-600">
        Rp {(product.selling_price || 0).toLocaleString('id-ID')}
      </p>
    </div>
  );
}
