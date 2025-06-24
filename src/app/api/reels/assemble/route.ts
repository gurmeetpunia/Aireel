import { NextResponse } from 'next/server';
import { assembleVideo } from '../../../../utils/videoAssembler';
import { uploadVideoToSupabase } from '../../../../utils/supabase';
import fs from 'fs';
import axios from 'axios';
import tmp from 'tmp';

export async function POST(request: Request) {
  try {
    const { imageUrl, audioUrl, duration } = await request.json();
    if (!imageUrl || !audioUrl) {
      return NextResponse.json({ error: 'imageUrl and audioUrl are required.' }, { status: 400 });
    }
    // Download image to temp file
    const imageTmp = tmp.fileSync({ postfix: '.jpg' });
    const imageResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imageTmp.name, imageResp.data);
    // Handle audio: local file path or remote URL
    let audioPath;
    if (typeof audioUrl === 'string' && (audioUrl.startsWith('http://') || audioUrl.startsWith('https://'))) {
      const audioTmp = tmp.fileSync({ postfix: '.mp3' });
      const audioResp = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(audioTmp.name, audioResp.data);
      audioPath = audioTmp.name;
      console.log('Audio file size:', fs.statSync(audioPath).size);
    } else {
      // Local file path, use directly
      audioPath = audioUrl;
      console.log('Audio file size:', fs.statSync(audioPath).size);
    }
    const videoPath = await assembleVideo({ imageUrl: imageTmp.name, audioUrl: audioPath, duration });
    const videoBuffer = fs.readFileSync(videoPath);
    // Upload to Supabase Storage
    const uploadResult = await uploadVideoToSupabase(videoBuffer);
    // Clean up temp files
    fs.unlinkSync(videoPath);
    imageTmp.removeCallback();
    // Do not remove audioPath if it's the original file (let the caller clean up)
    return NextResponse.json({
      videoUrl: uploadResult.publicUrl,
      filePath: uploadResult.filePath,
      id: uploadResult.id
    });
  } catch (error) {
    console.error('Video Assembly Error:', error);
    return NextResponse.json({ error: 'Failed to assemble video.' }, { status: 500 });
  }
}