import { NextResponse } from 'next/server';
import { generateCelebrityScriptCohere } from '@/utils/cohere';
import { generateSpeechElevenLabs } from '@/utils/elevenlabs';
import { fetchCelebrityImage } from '@/utils/unsplash';
import fs from 'fs';
import tmp from 'tmp';
import axios from 'axios';
import path from 'path';

const reelsJsonPath = path.join(process.cwd(), 'src', 'app', 'api', 'reels', 'reels.json');

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
    const audioTmp = tmp.fileSync({ postfix: '.mp3' });
    fs.writeFileSync(audioTmp.name, audioBuffer);
    const audioPath = audioTmp.name;

    // 3. Fetch image
    const imageUrl = await fetchCelebrityImage(celebrity);
    if (!imageUrl) return NextResponse.json({ error: 'No image found.' }, { status: 404 });

    // 4. Assemble video using local API
    const assembleUrl = process.env.ASSEMBLE_API_URL || 'http://localhost:3000/api/reels/assemble';
    const assembleRes = await axios.post(
      assembleUrl,
      { imageUrl, audioUrl: audioPath, duration: 15 },
      { responseType: 'json' }
    );
    const { videoUrl, id } = assembleRes.data;

    // Clean up temp audio file
    audioTmp.removeCallback();

    // 5. Save metadata to reels.json
    const reel = {
      id,
      title: `${celebrity} - AI History Reel`,
      celebrity,
      videoUrl,
      thumbnailUrl: imageUrl,
      script,
      createdAt: new Date().toISOString()
    };
    let reels = [];
    try {
      reels = JSON.parse(fs.readFileSync(reelsJsonPath, 'utf-8'));
    } catch {}
    reels.unshift(reel); // add to start
    fs.writeFileSync(reelsJsonPath, JSON.stringify(reels, null, 2));

    return NextResponse.json(reel);
  } catch (error) {
    console.error('AI Reel Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI reel.' }, { status: 500 });
  }
}