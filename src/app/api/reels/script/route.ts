import { NextResponse } from 'next/server';
import { generateCelebrityScriptCohere } from '@/utils/cohere';

export async function POST(request: Request) {
  try {
    const { celebrity } = await request.json();
    if (!celebrity || typeof celebrity !== 'string') {
      return NextResponse.json({ error: 'Celebrity name is required.' }, { status: 400 });
    }
    const script = await generateCelebrityScriptCohere(celebrity);
    return NextResponse.json({ script });
  } catch (error) {
    // Log the error for debugging
    console.error('OpenAI Script Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate script.' }, { status: 500 });
  }
}