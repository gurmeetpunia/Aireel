import { NextResponse } from 'next/server';
import { generateCelebrityScriptCohere } from '@/utils/cohere';
import { generateSpeechElevenLabs } from '@/utils/elevenlabs';
import { fetchCelebrityImage } from '@/utils/unsplash';
import { supabase, uploadAudioToSupabase } from '@/utils/supabase';
import axios from 'axios';

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
    // 3. Fetch image
    const imageUrl = await fetchCelebrityImage(celebrity);
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image found for the celebrity.' }, { status: 404 });
    }
    // 4. Assemble video using local API (pass audioUrl as a public URL)
    const assembleUrl = process.env.ASSEMBLE_API_URL || 'http://localhost:3000/api/reels/assemble';
    const assembleRes = await axios.post(
      assembleUrl,
      { imageUrl, audioUrl, duration: 15 }, // duration is hardcoded, adjust if needed
      { responseType: 'json' }
    );
    const { videoUrl, id } = assembleRes.data;
    // 5. Save metadata to Supabase 'reels' table
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
  } catch (error) {
    console.error('AI Reel Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI reel.' }, { status: 500 });
  }
}