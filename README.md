# 🎂 The Cake Point — Full Stack Bakery Website

A complete, production-ready bakery website with a customer-facing storefront and a secure admin panel. Built with React, Node.js, Express, and MongoDB Atlas.

---

## ✨ Features

### Customer Side
- Hero slider with 3 animated slides
- Cake catalog with category filters & search
- Shopping cart with quantity management & localStorage persistence
- Order form with cart summary & WhatsApp order button
- Contact form (messages saved to database)
- About page with bakery story & stats
- Floating WhatsApp button on all pages
- Fully responsive on mobile, tablet & desktop

### Admin Panel
- Secure JWT login
- Dashboard with stats — total cakes, orders, revenue, unread messages
- Recent orders & messages preview on dashboard
- Add / Edit / Delete cakes with image upload or URL
- View & manage all orders with status actions (Confirm → Deliver → Cancel)
- Contact messages inbox with read/unread state & delete
- Live unread message badge in sidebar

---

## 🎨 Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS v3           |
| Animation | Framer Motion                             |
| Icons     | React Icons (fi)                          |
| HTTP      | Axios                                     |
| Backend   | Node.js, Express                          |
| Database  | MongoDB Atlas + Mongoose                  |
| Auth      | JWT + bcryptjs                            |
| Upload    | Multer                                    |
| Toasts    | React Hot Toast                           |

---

## 🌈 Color Scheme

| Token      | Value     | Usage                  |
|------------|-----------|------------------------|
| brand-500  | `#d4821a` | Primary amber/gold     |
| dark       | `#1C1008` | Espresso text/bg       |
| muted      | `#7A6652` | Taupe secondary text   |
| surface    | `#FDFAF5` | Cream background       |

---

## 📁 Project Structure

```
Cake Shop Website/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── models/
│   │   ├── Cake.js           # Cake schema
│   │   ├── Order.js          # Order schema
│   │   └── Message.js        # Contact message schema
│   ├── routes/
│   │   ├── auth.js           # POST /login, POST /verify
│   │   ├── cakes.js          # CRUD /api/cakes
│   │   ├── orders.js         # CRUD /api/orders
│   │   └── messages.js       # CRUD /api/messages
│   ├── uploads/              # Multer uploaded images
│   ├── seed.js               # 12 sample cakes seeder
│   ├── server.js             # Express app entry point
│   └── .env                  # Environment variables (never commit)
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx        # Sticky navbar + demo banner + admin button
        │   ├── Footer.jsx        # Dark footer with links
        │   ├── CakeCard.jsx      # Cake grid card with hover overlay
        │   └── WhatsAppButton.jsx
        ├── context/
        │   └── CartContext.jsx   # Cart state with localStorage
        ├── pages/
        │   ├── Home.jsx          # Hero slider, featured cakes, offers
        │   ├── Cakes.jsx         # Catalog with filters
        │   ├── Cart.jsx          # Cart with animated items
        │   ├── Order.jsx         # Order form
        │   ├── About.jsx         # Bakery story
        │   ├── Contact.jsx       # Contact form (saves to DB)
        │   └── admin/
        │       ├── AdminLogin.jsx
        │       ├── AdminLayout.jsx   # Sidebar + topbar layout
        │       ├── AdminDashboard.jsx
        │       ├── AdminCakes.jsx
        │       ├── AdminOrders.jsx
        │       ├── AdminMessages.jsx
        │       └── CakeForm.jsx      # Add / Edit cake form
        └── utils/
            └── api.js            # Axios instance with JWT interceptor
```

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB on port 27017)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/Cake-Shop-Website.git
cd Cake-Shop-Website
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@cakepoint.com
ADMIN_PASSWORD=admin123
```

Start the backend:

```bash
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3. Seed Sample Cakes (optional)

```bash
node seed.js
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔐 Admin Panel

URL: `http://localhost:5173/admin`

| Field    | Value                  |
|----------|------------------------|
| Email    | admin@cakepoint.com    |
| Password | admin123               |

> Change these in `backend/.env` before deploying.

---

## 🌍 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide.

**Summary:**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com)
- Database → [MongoDB Atlas](https://cloud.mongodb.com)

---

## 📸 Pages Overview

| Page         | Route            |
|--------------|------------------|
| Home         | `/`              |
| Cakes        | `/cakes`         |
| Cart         | `/cart`          |
| Place Order  | `/order`         |
| About        | `/about`         |
| Contact      | `/contact`       |
| Admin Login  | `/admin`         |
| Dashboard    | `/admin/dashboard` |
| Manage Cakes | `/admin/cakes`   |
| Orders       | `/admin/orders`  |
| Messages     | `/admin/messages`|

---

## ⚠️ Important Notes

- Never commit your `.env` file — it's already in `.gitignore`
- The `uploads/` folder stores local images — on Render these reset on redeploy (use Cloudinary for persistent uploads in production)
- Update the WhatsApp number in `WhatsAppButton.jsx` and `Contact.jsx` before going live
- Update the Google Maps embed in `Contact.jsx` with your real address
