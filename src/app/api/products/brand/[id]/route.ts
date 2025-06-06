import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '15';

    const apiUrl = `${API_BASE_URL}/api/v1/products/brand/${params.id}?page=${page}&per_page=${perPage}`;
    console.log('Fetching products by brand from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products by brand' },
      { status: 500 }
    );
  }
}
