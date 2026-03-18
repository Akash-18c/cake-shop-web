# 🚀 Deployment Guide — The Cake Point

This guide deploys:
- **Frontend** → Vercel (free)
- **Backend** → Render (free)
- **Database** → MongoDB Atlas (already set up)

---

## Step 1 — Prepare Your GitHub Repo

### 1.1 Make sure `.gitignore` files are correct

`backend/.gitignore` must contain:
```
node_modules/
.env
uploads/
```

`frontend/.gitignore` must contain:
```
node_modules/
dist/
```

### 1.2 Push to GitHub

```bash
cd "d:\Cake Shop Website"
git init
git add .
git commit -m "Initial commit — The Cake Point"
git branch -M main
git remote add origin https://github.com/<your-username>/Cake-Shop-Website.git
git push -u origin main
```

> Replace `<your-username>` with your actual GitHub username.

---

## Step 2 — Deploy Backend on Render

### 2.1 Go to [render.com](https://render.com) → Sign up / Log in

### 2.2 Create a New Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub account and select **Cake-Shop-Website** repo
3. Fill in the settings:

| Field            | Value                        |
|------------------|------------------------------|
| Name             | `cakepoint-backend`          |
| Root Directory   | `backend`                    |
| Runtime          | `Node`                       |
| Build Command    | `npm install`                |
| Start Command    | `node server.js`             |
| Instance Type    | Free                         |

### 2.3 Add Environment Variables

In Render → your service → **Environment** tab, add:

| Key             | Value                                      |
|-----------------|--------------------------------------------|
| `PORT`          | `5000`                                     |
| `MONGO_URI`     | your MongoDB Atlas connection string       |
| `JWT_SECRET`    | `cakepoint_super_secret_key_2024`          |
| `ADMIN_EMAIL`   | `admin@cakepoint.com`                      |
| `ADMIN_PASSWORD`| `admin123`                                 |

### 2.4 Deploy

Click **Create Web Service**. Wait ~2 minutes for the first deploy.

Your backend URL will be something like:
```
https://cakepoint-backend.onrender.com
```

> Copy this URL — you need it for the frontend.

---

## Step 3 — Update Frontend API URL

Open `frontend/src/utils/api.js` and replace the baseURL:

```js
const API = axios.create({
  baseURL: 'https://cakepoint-backend.onrender.com/api',
});
```

Then commit and push:

```bash
git add frontend/src/utils/api.js
git commit -m "Update API baseURL for production"
git push
```

---

## Step 4 — Deploy Frontend on Vercel

### 4.1 Go to [vercel.com](https://vercel.com) → Sign up with GitHub

### 4.2 Import Project

1. Click **Add New** → **Project**
2. Select your **Cake-Shop-Website** repo
3. Fill in the settings:

| Field            | Value        |
|------------------|--------------|
| Root Directory   | `frontend`   |
| Framework Preset | `Vite`       |
| Build Command    | `npm run build` |
| Output Directory | `dist`       |

### 4.3 Deploy

Click **Deploy**. Vercel builds and deploys in ~1 minute.

Your live URL will be:
```
https://cake-shop-website.vercel.app
```

---

## Step 5 — Fix CORS on Backend

Open `backend/server.js` and update CORS to allow your Vercel domain:

```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cake-shop-website.vercel.app',
  ],
  credentials: true,
}));
```

Commit and push — Render will auto-redeploy:

```bash
git add backend/server.js
git commit -m "Fix CORS for production"
git push
```

---

## Step 6 — Fix React Router on Vercel

Create `frontend/public/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Commit and push:

```bash
git add frontend/public/vercel.json
git commit -m "Add Vercel SPA routing fix"
git push
```

---

## Step 7 — MongoDB Atlas Network Access

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Your project → **Network Access**
3. Click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Confirm**

This allows Render's servers to connect to your database.

---

## ✅ Final Checklist

- [ ] Backend live on Render and returning data
- [ ] `api.js` baseURL updated to Render URL
- [ ] Frontend live on Vercel
- [ ] CORS updated with Vercel domain
- [ ] `vercel.json` added for SPA routing
- [ ] MongoDB Atlas allows all IPs
- [ ] Admin login works at `https://your-site.vercel.app/admin`
- [ ] Contact form saves messages to DB
- [ ] Orders can be placed from frontend

---

## 🔁 Future Updates

Every time you push to `main`:
- **Vercel** auto-redeploys the frontend
- **Render** auto-redeploys the backend

No manual steps needed after initial setup.

---

## ⚠️ Free Tier Limitations

| Service | Limitation                                              |
|---------|---------------------------------------------------------|
| Render  | Spins down after 15 min inactivity — first request is slow (~30s) |
| Vercel  | 100GB bandwidth/month — more than enough               |
| Atlas   | 512MB storage on free tier                             |

To avoid Render cold starts, you can use [UptimeRobot](https://uptimerobot.com) (free) to ping your backend URL every 10 minutes.
