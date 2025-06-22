import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const reelsJsonPath = path.join(process.cwd(), 'src', 'app', 'api', 'reels', 'reels.json');

export async function GET() {
  try {
    const reels = JSON.parse(fs.readFileSync(reelsJsonPath, 'utf-8'));
    return NextResponse.json({ reels });
  } catch (error) {
    return NextResponse.json({ reels: [], error: 'Failed to load reels.' }, { status: 500 });
  }
}