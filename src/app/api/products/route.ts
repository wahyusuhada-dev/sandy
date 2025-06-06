import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '15', 10);

    // Validate parameters
    if (isNaN(page) || page < 1) {
      console.error('[API] Invalid page parameter:', page);
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      );
    }

    const apiUrl = `${API_BASE_URL}/api/v1/products?page=${page}&per_page=${perPage}`;
    console.log('[API] Fetching products from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: apiUrl,
      });
      throw new Error(`API responded with status: ${response.status} - ${errorText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('[API] Failed to parse JSON response:', e);
      return NextResponse.json(
        { error: 'Invalid JSON response from API' },
        { status: 500 }
      );
    }

    // Validate and transform the response
    if (!data || !Array.isArray(data.data)) {
      console.error('[API] Invalid response structure:', data);
      return NextResponse.json(
        { error: 'Invalid API response structure' },
        { status: 500 }
      );
    }

    // Calculate total pages based on the total count
    const total = data.total || data.data.length * 2; // If total is not provided, estimate it
    const lastPage = Math.max(Math.ceil(total / perPage), page + 1); // Ensure there's at least one more page

    // Transform and structure the response with proper pagination
    const transformedData = {
      data: data.data.map((product: any) => ({
        ...product,
        images: product.images || {
          images_id: null,
          image_path: null,
          is_primary: null,
        },
      })),
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total: total,
    };

    // Log successful response with pagination info
    console.log('[API] Success:', {
      page: transformedData.current_page,
      itemCount: transformedData.data.length,
      totalItems: transformedData.total,
      lastPage: transformedData.last_page,
      perPage: transformedData.per_page,
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
