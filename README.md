# AI-Generated Sports Celebrity History Reels

## 📚 API Documentation

### Base URL

- **Local:** `http://localhost:3000/api`
- **Production:** `https://your-vercel-app.vercel.app/api`

---

### 1. Get All Reels

**Endpoint:** `GET /api/reels`

**Description:**  
Returns a list of all generated reels with metadata.

**Response Example:**

```json
{
  "reels": [
    {
      "id": "abc123",
      "title": "History of LeBron James",
      "celebrity": "LeBron James",
      "videoUrl": "https://your-supabase-url/video.mp4",
      "thumbnailUrl": "https://your-supabase-url/thumb.jpg",
      "createdAt": "2024-06-22T12:34:56Z"
    }
  ]
}
```

---

### 2. Generate a New Reel

**Endpoint:** `POST /api/reels/generate`

**Description:**  
Triggers AI to generate a new sports celebrity history reel.

**Request Body:**

```json
{
  "celebrity": "LeBron James"
}
```

**Response Example:**

```json
{
  "success": true,
  "reel": {
    "id": "abc123",
    "title": "History of LeBron James",
    "celebrity": "LeBron James",
    "videoUrl": "https://your-supabase-url/video.mp4",
    "thumbnailUrl": "https://your-supabase-url/thumb.jpg",
    "createdAt": "2024-06-22T12:34:56Z"
  }
}
```

---

### 3. Delete a Reel

**Endpoint:** `DELETE /api/reels/[id]`

**Description:**  
Deletes a reel by its ID.

**Response Example:**

```json
{
  "success": true,
  "message": "Reel deleted"
}
```

---

### 4. (Optional) Other Endpoints

If you have endpoints for:

- `/api/reels/image` (image generation)
- `/api/reels/tts` (text-to-speech)
- `/api/reels/script` (script generation)
- `/api/reels/assemble` (video assembly)

Document them similarly if you want to expose them.

---

## How to Use

- All endpoints are RESTful and return JSON.
- For POST endpoints, send `Content-Type: application/json` in headers.

---

## 🛠️ Technical Breakdown

### **Stack & Architecture**

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend/API:** Next.js API routes
- **AI Integration:** OpenAI (script), ElevenLabs/Amazon Polly (TTS), Unsplash (images), Shotstack/RunwayML (video assembly)
- **Storage:** Supabase (for video, image, and metadata storage)
- **Deployment:** Vercel

---

### **AI Pipeline**

1. **Script Generation:**  
   Uses OpenAI to generate a short, engaging script about the selected sports celebrity.
2. **Image Sourcing:**  
   Fetches relevant images using the Unsplash API.
3. **Text-to-Speech (TTS):**  
   Converts the script to audio using ElevenLabs or Amazon Polly.
4. **Video Assembly:**  
   Combines images and TTS audio into a video using Shotstack or RunwayML.
5. **Storage:**  
   The final video and its metadata are uploaded to Supabase.

---

### **API Endpoints**

- `GET /api/reels` — List all reels (with metadata)
- `POST /api/reels/generate` — Generate a new reel (AI pipeline)
- `DELETE /api/reels/[id]` — Delete a reel
- (See API Documentation above for details)

---

### **Frontend UI/UX**

- **Sidebar:**  
  Search for celebrities, view and manage reels, mobile-friendly.
- **Vertical Reel Player:**  
  TikTok-style, full-screen, vertical snapping, smooth playback, lazy loading.
- **Mobile Optimization:**  
  Responsive design, touch-friendly controls, and smooth transitions.

---

### **Deployment & Configuration**

- **Vercel:**  
  Deployed via GitHub integration.
- **Environment Variables:**  
  Set Supabase and AI API keys in Vercel dashboard.
- **Production Ready:**  
  Next.js dev tools and overlays are hidden in production.

---

### **How It Works (User Flow)**

1. User searches for a sports celebrity in the sidebar.
2. The app generates a script, images, and TTS audio, then assembles a video.
3. The new reel appears in the sidebar and can be viewed in the main vertical player.
4. Users can scroll through reels, play/pause, and delete reels as needed.

---

### **Contact & Credits**

- Built by Gurmeet
- For questions, contact: gurmeet210188@gmail.com
