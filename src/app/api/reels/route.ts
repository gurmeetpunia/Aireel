import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
  const { data: reels, error } = await supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ reels: [], error: 'Failed to load reels.' }, { status: 500 });
  }

  // Map DB fields to frontend fields if needed
  const mappedReels = (reels || []).map(r => ({
    id: r.id,
    title: r.title,
    celebrity: r.celebrity,
    videoUrl: r.video_url,
    thumbnailUrl: r.thumbnail_url,
    script: r.script,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ reels: mappedReels });
}