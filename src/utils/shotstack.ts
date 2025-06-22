import axios from 'axios';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const SHOTSTACK_API_URL = 'https://api.shotstack.io/v1/render';

export async function assembleVideoShotstack({ imageUrl, audioUrl, duration = 10 }: { imageUrl: string, audioUrl: string, duration?: number }) {
  if (!SHOTSTACK_API_KEY) throw new Error('Missing Shotstack API key');

  const timeline = {
    background: '#000000',
    tracks: [
      {
        clips: [
          {
            asset: {
              type: 'image',
              src: imageUrl,
            },
            start: 0,
            length: duration,
            transition: {
              in: 'fade',
              out: 'fade',
            },
          },
        ],
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
    return response.data.id; // renderId
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