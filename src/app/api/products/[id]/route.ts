import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/products/${params.id}`;
    console.log('[API] Fetching product details from:', apiUrl);

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
        body: errorText
      });
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[API] Product detail response:', data);
    
    // Transform the response to ensure consistent structure
    const transformedData = {
      ...data,
      images: data.images || {
        images_id: null,
        image_path: null,
        is_primary: null
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('[API] Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
