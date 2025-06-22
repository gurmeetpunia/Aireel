import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const reelsJsonPath = path.join(process.cwd(), 'src', 'app', 'api', 'reels', 'reels.json');

const reels = [
  {
    id: '1',
    title: 'The Rise of Lionel Messi',
    celebrity: 'Lionel Messi',
    videoUrl: 'https://example.com/videos/messi.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/messi.jpg',
    createdAt: '2024-06-01T12:00:00Z',
  },
  {
    id: '2',
    title: 'Serena Williams: Grand Slam Queen',
    celebrity: 'Serena Williams',
    videoUrl: 'https://example.com/videos/serena.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/serena.jpg',
    createdAt: '2024-06-02T15:30:00Z',
  },
];

// GET handler to fetch a single reel if needed (optional)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reelId = params.id;
    const reelsData = fs.readFileSync(reelsJsonPath, 'utf-8');
    const reels = JSON.parse(reelsData);
    const reel = reels.find((r: { id: string }) => r.id === reelId);

    if (!reel) {
      return NextResponse.json({ error: 'Reel not found.' }, { status: 404 });
    }
    return NextResponse.json(reel);
  } catch (error) {
    console.error('Fetch Reel Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reel.' }, { status: 500 });
  }
}

// DELETE handler to remove a reel
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reelId = params.id;
    if (!reelId) {
      return NextResponse.json({ error: 'Reel ID is required.' }, { status: 400 });
    }

    const reelsData = fs.readFileSync(reelsJsonPath, 'utf-8');
    let reels = JSON.parse(reelsData);

    const initialLength = reels.length;
    const updatedReels = reels.filter((reel: { id: string }) => reel.id !== reelId);

    if (updatedReels.length === initialLength) {
      return NextResponse.json({ error: 'Reel not found to delete.' }, { status: 404 });
    }

    fs.writeFileSync(reelsJsonPath, JSON.stringify(updatedReels, null, 2));

    return NextResponse.json({ message: 'Reel deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Delete Reel Error:', error);
    return NextResponse.json({ error: 'Failed to delete reel.' }, { status: 500 });
  }
} 