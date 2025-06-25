import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseBucket = process.env.SUPABASE_BUCKET!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadVideoToSupabase(buffer: Buffer, ext = 'mp4') {
  const id = uuidv4();
  const filePath = `${id}.${ext}`;
  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .upload(filePath, buffer, {
      contentType: 'video/mp4',
      upsert: false,
    });
  if (error) throw error;
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath);
  return {
    id,
    filePath,
    publicUrl: publicUrlData?.publicUrl,
  };
}

export async function uploadAudioToSupabase(buffer: Buffer, ext = 'mp3') {
  const id = uuidv4();
  const filePath = `${id}.${ext}`;
  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .upload(filePath, buffer, {
      contentType: 'audio/mpeg',
      upsert: false,
    });
  if (error) throw error;
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath);
  return {
    id,
    filePath,
    publicUrl: publicUrlData?.publicUrl,
  };
}
