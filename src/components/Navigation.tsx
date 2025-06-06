'use client';

import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchBrands, fetchCategories } from '@/lib/api';

export default function Navigation() {
  const router = useRouter();

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: brandsResponse } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands
  });

  // Access the data array from the response
  const categories = categoriesResponse?.data || [];
  const brands = brandsResponse?.data || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (categoryId) {
      router.push(`/category/${categoryId}`);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    if (brandId) {
      router.push(`/brand/${brandId}`);
    }
  };

  return (
    <Flex gap={4}>
      <select
        onChange={handleCategoryChange}
        style={{
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #E2E8F0'
        }}
      >
        <option value="">Select Category</option>
        {categories?.map((category: { id: number; category_name: string }) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>
      <select
        onChange={handleBrandChange}
        style={{
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #E2E8F0'
        }}
      >
        <option value="">Select Brand</option>
        {brands?.map((brand: { id: number; brand_name: string }) => (
          <option key={brand.id} value={brand.id}>
            {brand.brand_name}
          </option>
        ))}
      </select>
    </Flex>
  );
}
