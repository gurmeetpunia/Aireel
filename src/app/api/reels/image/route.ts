import { NextResponse } from 'next/server';
import { fetchCelebrityImage } from '@/utils/unsplash';

export async function POST(request: Request) {
  try {
    const { celebrity } = await request.json();
    if (!celebrity || typeof celebrity !== 'string') {
      return NextResponse.json({ error: 'Celebrity name is required.' }, { status: 400 });
    }
    const imageUrl = await fetchCelebrityImage(celebrity);
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image found.' }, { status: 404 });
    }
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Unsplash Image Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch image.' }, { status: 500 });
  }
} 