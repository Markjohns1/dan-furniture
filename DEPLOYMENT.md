# 🚀 Deployment Guide - Dan Classic Furniture

This guide walks you through deploying the Dan Classic Furniture e-commerce platform to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository with your code pushed
- [ ] A [Render](https://render.com) account (free tier available)
- [ ] A [Vercel](https://vercel.com) account (free tier available)
- [ ] A [Neon](https://neon.tech) or [Supabase](https://supabase.com) account for PostgreSQL (free tier available)

---

## Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

**Option A: Using Neon (Recommended - Free)**

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

**Option B: Using Render PostgreSQL**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Fill in:
   - Name: `dan-furniture-db`
   - Region: Choose closest to your users
   - Plan: Free
4. Click **Create Database**
5. Copy the **External Database URL**

---

### Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `dan-furniture-api` |
| **Region** | Choose closest to users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

5. Add **Environment Variables** (click "Advanced" → "Add Environment Variable"):

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
| `WHATSAPP_NUMBER` | `254XXXXXXXXX` (client's number) |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` (update after frontend deploy) |

6. Click **Create Web Service**
7. Wait for deployment (takes 2-5 minutes)
8. Note your backend URL: `https://dan-furniture-api.onrender.com`

---

### Step 3: Initialize Database

After first deployment, you need to seed the database:

**Option A: Using Render Shell**
1. Go to your Render service → **Shell** tab
2. Run: `python seed.py`

**Option B: Manual via API**
- The database tables are auto-created on first startup
- Create admin user via the registration API or direct database access

---

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. Add **Environment Variable**:

| Variable | Value |
|----------|-------|
| `VITE_API_HOST` | `https://dan-furniture-api.onrender.com` (your Render URL) |

6. Click **Deploy**
7. Note your frontend URL: `https://dan-furniture.vercel.app`

---

## Post-Deployment Configuration

### Update Backend CORS

After getting your Vercel URL, update your Render backend:

1. Go to Render Dashboard → Your Service → **Environment**
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://dan-furniture.vercel.app
   ```
3. Click **Save Changes** (service will auto-redeploy)

---

### Verify Everything Works

1. **Visit your frontend URL** → Should load the homepage
2. **Test login** with default admin:
   - Email: `admin@danfurniture.co.ke`
   - Password: `admin123`
3. **Test API** → Visit `https://your-backend-url.onrender.com/docs`
4. **Test image uploads** → Add a product with images
5. **Test WhatsApp** → Add item to cart and checkout

---

## Custom Domain Setup

### For Frontend (Vercel)

1. Go to Vercel → Your Project → **Settings** → **Domains**
2. Add your domain: `www.danclassicfurniture.co.ke`
3. Update DNS records as instructed by Vercel
4. SSL is automatic

### For Backend (Render)

1. Go to Render → Your Service → **Settings** → **Custom Domains**
2. Add your domain: `api.danclassicfurniture.co.ke`
3. Update DNS records as instructed
4. Update frontend `VITE_API_HOST` to new domain

---

## Production Checklist

Before going live:

- [ ] Generated new `SECRET_KEY` (not the dev default)
- [ ] Using PostgreSQL (not SQLite)
- [ ] Set correct `WHATSAPP_NUMBER`
- [ ] Set correct `FRONTEND_URL` for CORS
- [ ] Changed default admin password
- [ ] Tested all functionality
- [ ] SSL enabled (automatic on Render/Vercel)

---

## Troubleshooting

### Images Not Loading

**Problem:** Product images show broken/404
**Solution:** Ensure `VITE_API_HOST` matches your Render backend URL exactly

### CORS Errors

**Problem:** API requests blocked
**Solution:** Update `FRONTEND_URL` in Render to match your Vercel URL exactly

### Login Not Working

**Problem:** Can't login with default credentials
**Solution:** Run `python seed.py` in Render Shell to create admin user

### Slow First Load

**Problem:** Site takes 30+ seconds to load initially
**Solution:** This is normal on Render free tier (cold starts). Upgrade to paid tier for instant loads.

---

## Cost Breakdown (Free Tier)

| Service | Provider | Cost |
|---------|----------|------|
| Backend | Render Free | $0/month |
| Database | Neon Free | $0/month |
| Frontend | Vercel Free | $0/month |
| **Total** | | **$0/month** |

> ⚠️ Free tiers have limitations (cold starts, limited resources). For production with real traffic, consider paid tiers (~$7-25/month total).

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

---

**Happy Deploying! 🚀**
