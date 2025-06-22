import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

export async function generateCelebrityScriptCohere(celebrity: string): Promise<string> {
  const prompt = `Write a short, engaging, and inspiring 60-second video script about the sports history and achievements of ${celebrity}. Make it suitable for a TikTok-style reel.`;
  const response = await cohere.generate({
    model: 'command',
    prompt,
    maxTokens: 300,
    temperature: 0.8,
  });
  return response.generations[0]?.text?.trim() || '';
}