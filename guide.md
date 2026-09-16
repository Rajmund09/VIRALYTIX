# VIRALYTIX - Complete Free Deployment Guide

This guide will walk you through deploying your entire VIRALYTIX stack (Next.js Frontend + FastAPI Backend) completely for **free**. 

We will use **Render** for the backend and **Vercel** for the frontend.

---

## Part 1: Backend Deployment (Render - Free Tier)

Render provides a fantastic free tier for Python Web Services. 

> [!WARNING]
> **Important Note about SQLite on Free Tiers**
> Render's free tier uses an ephemeral filesystem. This means every time your backend goes to sleep (after 15 mins of inactivity) or deploys, your `viralytix.db` SQLite database will be reset. This is totally fine for a portfolio demo! If you want persistent data later, you can swap the SQLite URL for a free PostgreSQL database URL from **Supabase** or **Neon**.

### Step 1: Prepare the Backend for Deployment
Your backend is mostly ready, but we need to ensure the startup command is clear for Render.

1. Ensure your `backend/requirements.txt` has `uvicorn`, `fastapi`, and all other dependencies listed. (It already does).
2. Your startup command will be `uvicorn app.main:app --host 0.0.0.0 --port 10000`.

### Step 2: Deploy on Render
1. Go to [Render.com](https://render.com/) and create a free account using your GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`Rajmund09/VIRALYTIX`).
4. Configure the Web Service:
   - **Name**: `viralytix-backend` (or whatever you prefer)
   - **Language**: `Python 3`
   - **Branch**: `main`
   - **Root Directory**: `backend` *(<- This is crucial!)*
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.
6. **Wait for Deployment**: Render will build and deploy your API. Once it's live, copy the URL at the top left (e.g., `https://viralytix-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Vercel - Free Tier)

Vercel is the company that created Next.js, and their free tier is incredibly generous, lightning-fast, and completely permanent.

### Step 1: Prepare the Frontend
Vercel needs to know the URL of your newly deployed Render backend so it can talk to it in production.

1. In your `frontend/` folder, you are currently using `process.env.NEXT_PUBLIC_API_URL` to point to the backend. We will set this environment variable in Vercel.

### Step 2: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/) and create a free account using your GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`Rajmund09/VIRALYTIX`).
4. Configure the Project:
   - **Project Name**: `viralytix`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click `Edit` and select `frontend`. *(<- This is crucial!)*
5. Expand the **Environment Variables** section and add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://viralytix-backend.onrender.com` *(Paste your actual Render backend URL here. Make sure there is NO trailing slash `/` at the end).*
6. Click **Deploy**.
7. Vercel will build and launch your frontend. Once complete, you will be given a live URL (e.g., `https://viralytix.vercel.app`).

---

## Part 3: Fixing CORS (Crucial Final Step)

Right now, your backend might reject requests from your new Vercel domain because of CORS (Cross-Origin Resource Sharing) security.

You need to update your backend to allow your Vercel URL.

1. Open `backend/app/main.py`.
2. Find the CORS configuration section:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app-url.vercel.app" # <-- ADD YOUR VERCEL URL HERE
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
3. Commit this change and push it to GitHub:
   ```bash
   git add backend/app/main.py
   git commit -m "chore: update cors origins for production"
   git push origin main
   ```
4. Render will automatically detect the push and redeploy your backend with the new CORS rules.

---

## You're Live! 🚀
Once Render finishes deploying the CORS update, go to your Vercel URL. Your VIRALYTIX platform is now fully deployed and completely free to host indefinitely!

### Troubleshooting
- **Backend takes 50 seconds to load?**: This is normal for Render's free tier. If the API hasn't been used in 15 minutes, it goes to sleep. The first request wakes it up.
- **Uploads failing?**: Render's free tier has memory limits. Ensure you aren't trying to upload massive 500MB video files during testing. Stick to smaller clips.
