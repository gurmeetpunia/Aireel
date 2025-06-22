import ffmpeg from 'fluent-ffmpeg';
// import ffmpegPath from 'ffmpeg-static';
import tmp from 'tmp';

// Assemble a video from a single image and audio file
export async function assembleVideo({ imageUrl, audioUrl, duration = 15 }: { imageUrl: string, audioUrl: string, duration?: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: '.mp4' });
    
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
      .on('error', (err, stdout, stderr) => {
          console.error('ffmpeg stderr:', stderr);
          reject(err);
      })
      .save(output);
  });
}

export function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
      if (duration) {
        resolve(duration);
      } else {
        reject(new Error('Could not read audio duration from metadata.'));
      }
    });
  });
}
