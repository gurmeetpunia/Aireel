import ffmpeg from 'fluent-ffmpeg';
// import ffmpegPath from 'ffmpeg-static';
import tmp from 'tmp';

// Assemble a video from a single image and audio file
export async function assembleVideo({ imageUrl, audioUrl, duration = 15 }: { imageUrl: string, audioUrl: string, duration?: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: '.mp4' });
    ffmpeg.setFfmpegPath('ffmpeg'); // Use system ffmpeg
    ffmpeg()
      .addInput(imageUrl)
      .loop(duration)
      .addInput(audioUrl)
      .outputOptions([
        '-c:v libx264',
        '-t ' + duration,
        '-pix_fmt yuv420p',
        '-vf scale=720:1280', // vertical video
        '-shortest'
      ])
      .on('end', () => resolve(output))
      .on('error', (err) => reject(err))
      .save(output);
  });
}
