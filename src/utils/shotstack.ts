import axios from 'axios';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const SHOTSTACK_API_URL = 'https://api.shotstack.io/v1/render';

export async function assembleVideoShotstack({ 
  imageUrls, 
  audioUrl, 
  duration = 15 
}: { 
  imageUrls: string[], 
  audioUrl: string, 
  duration?: number 
}) {
  if (!SHOTSTACK_API_KEY) throw new Error('Missing Shotstack API key');

  const numImages = imageUrls.length;
  if (numImages === 0) throw new Error('No images provided for video assembly.');

  const clipDuration = duration / numImages;

  const imageClips = imageUrls.map((url, index) => {
    return {
      asset: {
        type: 'image',
        src: url,
      },
      start: index * clipDuration,
      length: clipDuration,
      transition: {
        in: 'fade',
        out: 'fade',
      },
      effect: 'zoomIn',
    };
  });

  const timeline = {
    background: '#000000',
    tracks: [
      {
        clips: imageClips,
      },
      {
        clips: [
          {
            asset: {
              type: 'audio',
              src: audioUrl,
            },
            start: 0,
            length: duration,
          },
        ],
      },
    ],
  };

  const payload = {
    timeline,
    output: {
      format: 'mp4',
      resolution: 'sd',
    },
  };

  try {
    const response = await axios.post(SHOTSTACK_API_URL, payload, {
      headers: {
        'x-api-key': SHOTSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('Shotstack full response:', response.data);
    return response.data; // full Shotstack response
  } catch (error: any) {
    if (error.response) {
      console.error('Shotstack API Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      if (error.response.data?.response?.error?.details) {
        console.error('Shotstack Validation Details:', error.response.data.response.error.details);
        throw new Error(JSON.stringify(error.response.data.response.error.details));
      }
    } else {
      console.error('Shotstack Unknown Error:', error);
    }
    throw error;
  }
}

export async function getShotstackRenderStatus(renderId: string) {
  if (!SHOTSTACK_API_KEY) throw new Error('Missing Shotstack API key');
  const url = `https://api.shotstack.io/v1/render/${renderId}`;
  const response = await axios.get(url, {
    headers: {
      'x-api-key': SHOTSTACK_API_KEY,
    },
  });
  return response.data; // includes status and url if ready
} 