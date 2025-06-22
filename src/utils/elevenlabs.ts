import fs from 'fs';
import path from 'path';

export async function generateSpeechElevenLabs(text: string, voiceId = 'cgSgspJ2msm6clMCkdW9', modelId = 'eleven_monolingual_v1'): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('Missing ElevenLabs API key');

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  });
  console.log('ElevenLabs response status:', response.status, response.statusText);
  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log('ElevenLabs audio buffer size:', buffer.length);
  if (buffer.length < 1000) {
    console.warn('Warning: ElevenLabs audio buffer is very small, may not be a valid MP3.');
  }
  return buffer;
}