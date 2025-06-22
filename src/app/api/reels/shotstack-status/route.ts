import { NextResponse } from 'next/server';
import { getShotstackRenderStatus } from '@/utils/shotstack';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const renderId = searchParams.get('renderId');
    if (!renderId) {
      return NextResponse.json({ error: 'renderId is required.' }, { status: 400 });
    }
    const status = await getShotstackRenderStatus(renderId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Shotstack Status Error:', error);
    return NextResponse.json({ error: 'Failed to fetch Shotstack render status.' }, { status: 500 });
  }
} 