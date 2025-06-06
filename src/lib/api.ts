import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

export interface ProductImage {
  images_id: string | null;
  image_path: string | null;
  is_primary: boolean | null;
}

export interface Product {
  id: number;
  product_name: string;
  product_code: string;
  barcode: string | null;
  qr_code: string | null;
  brand: {
    id: number;
    brand_name: string;
  };
  category: {
    id: number;
    category_name: string;
  };
  model: string | null;
  description: string | null;
  selling_price: number;
  is_active: number;
  images: ProductImage | null;
}

export interface ApiResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const fetchProducts = async (page: number = 1, perPage: number = 12) => {
  const response = await api.get<ApiResponse<Product>>(`/products?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get<ApiResponse<{ id: number; category_name: string }>>('/categories');
  return response.data;
};

export const fetchBrands = async () => {
  const response = await api.get<ApiResponse<{ id: number; brand_name: string }>>('/brands');
  return response.data;
};

export const fetchProductsByCategory = async (categoryId: number, page: number = 1) => {
  const response = await api.get<ApiResponse<Product>>(`/products/category/${categoryId}?page=${page}`);
  return response.data;
};

export const fetchProductsByBrand = async (brandId: number, page: number = 1) => {
  const response = await api.get<ApiResponse<Product>>(`/products/brand/${brandId}?page=${page}`);
  return response.data;
};
