import { NextResponse } from 'next/server';
import { assembleVideoShotstack } from '@/utils/shotstack';

export async function POST(request: Request) {
  try {
    const { imageUrl, audioUrl, duration } = await request.json();
    if (!imageUrl || !audioUrl) {
      return NextResponse.json({ error: 'imageUrl and audioUrl are required.' }, { status: 400 });
    }
    const renderId = await assembleVideoShotstack({ imageUrls: [imageUrl], audioUrl, duration });
    return NextResponse.json({ renderId });
  } catch (error) {
    console.error('Shotstack Assemble Error:', error);
    return NextResponse.json({ error: 'Failed to start Shotstack render.' }, { status: 500 });
  }
} 