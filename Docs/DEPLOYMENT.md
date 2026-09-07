# PlaceIQ Deployment Guide

This document covers production deployment across Vercel (Frontend), Render/Railway/Docker (Backend), and Supabase (Database & Authentication).

---

## 1. Database & Authentication Setup (Supabase)

1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Apply the migration file located at `supabase/migrations/20260907_init_schema.sql` via the Supabase SQL Editor or Supabase CLI:
   ```bash
   supabase db push
   ```
3. Copy your project URL (`https://<project-ref>.supabase.co`) and Publishable Anon Key from **Project Settings > API**.

---

## 2. Backend Deployment (Render / Railway / Docker)

### Option A: Render / Railway Deployment
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `PORT`: `8000`
  - `MODEL_PATH`: `models/placement_model_balanced.joblib`
  - `SUPABASE_URL`: `https://<your-project>.supabase.co`
  - `SUPABASE_ANON_KEY`: `<your-anon-key>`

### Option B: Docker Container Deployment
```bash
docker build -t placeiq-backend ./backend
docker run -d -p 8000:8000 --name placeiq-api placeiq-backend
```

---

## 3. Frontend Deployment (Vercel / Netlify)

1. Link your GitHub repository to Vercel.
2. Configure project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://<your-backend-url>/api/v1`
   - `VITE_SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-anon-key>`

---

## 4. Local Full-Stack Execution via Docker Compose

Run the entire platform locally with a single command:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`
