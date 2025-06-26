import { NextResponse } from 'next/server';
import { generateCelebrityScriptCohere } from '@/utils/cohere';
import { generateSpeechElevenLabs } from '@/utils/elevenlabs';
import { fetchCelebrityImage } from '@/utils/unsplash';
import { supabase, uploadAudioToSupabase } from '@/utils/supabase';
import axios from 'axios';

async function pollShotstackStatus(renderId: string, maxAttempts = 40, intervalMs = 5000): Promise<string> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/reels/shotstack-status?renderId=${renderId}`);
    const statusData = statusRes.data;
    console.log(`Polling Shotstack: attempt ${attempts + 1}, status:`, statusData);
    if (statusData.response.status === 'done' && statusData.response.url) {
      return statusData.response.url;
    }
    if (statusData.response.status === 'failed') {
      console.error('Shotstack render failed:', statusData);
      throw new Error('Shotstack render failed');
    }
    await new Promise(res => setTimeout(res, intervalMs));
    attempts++;
  }
  throw new Error('Shotstack render timed out');
}

export async function POST(request: Request) {
  try {
    const { celebrity } = await request.json();
    if (!celebrity || typeof celebrity !== 'string') {
      return NextResponse.json({ error: 'Celebrity name is required.' }, { status: 400 });
    }
    // 1. Generate script
    const script = await generateCelebrityScriptCohere(celebrity);
    // 2. Generate audio
    const audioBuffer = await generateSpeechElevenLabs(script);
    // 2.1 Upload audio to Supabase Storage
    const audioUpload = await uploadAudioToSupabase(audioBuffer, 'mp3');
    const audioUrl = audioUpload.publicUrl;
    console.log('Audio uploaded to Supabase:', audioUrl);
    // 3. Fetch image
    const imageUrl = await fetchCelebrityImage(celebrity);
    console.log('Fetched image URL:', imageUrl);
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image found for the celebrity.' }, { status: 404 });
    }
    // 4. Assemble video using Shotstack
    const shotstackRes = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/reels/shotstack-assemble`, {
      imageUrl,
      audioUrl,
      duration: 15
    });
    console.log('Shotstack response:', shotstackRes.data);
    const renderId = shotstackRes.data?.response?.id;
    console.log('Render ID:', renderId);
    if (!renderId) {
      return NextResponse.json({ error: 'Failed to start Shotstack render.' }, { status: 500 });
    }
    // 5. Poll for video completion
    const videoUrl = await pollShotstackStatus(renderId);
    console.log('Final video URL:', videoUrl);
    const id = renderId;
    // 6. Save metadata to Supabase 'reels' table
    const { error: dbError } = await supabase.from('reels').insert([
      {
        id,
        title: `${celebrity} - AI History Reel`,
        celebrity,
        video_url: videoUrl,
        thumbnail_url: imageUrl,
        script,
        created_at: new Date().toISOString(),
      },
    ]);
    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      return NextResponse.json({ error: 'Failed to save reel metadata.' }, { status: 500 });
    }
    const reel = {
      id,
      title: `${celebrity} - AI History Reel`,
      celebrity,
      videoUrl,
      thumbnailUrl: imageUrl,
      script,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(reel);
  } catch (error: any) {
    console.error('AI Reel Generation Error:', error, error?.response?.data);
    return NextResponse.json({ error: 'Failed to generate AI reel.' }, { status: 500 });
  }
}