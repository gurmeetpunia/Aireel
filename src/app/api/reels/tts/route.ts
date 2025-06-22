import { NextResponse } from 'next/server';
import { generateSpeechElevenLabs } from '@/utils/elevenlabs';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }
    const audioBuffer = await generateSpeechElevenLabs(text);
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech.' }, { status: 500 });
  }
} 