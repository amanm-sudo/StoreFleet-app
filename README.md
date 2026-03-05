<div align="center">

# ⚡ StoreFleet

### A full-stack e-commerce platform built for the Coding Ninjas Capstone Project

[![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📸 Preview

> Dark-mode glassmorphism design with blue/violet gradient accents.

**Home Page** — Hero section with animated orbs, feature cards, category grid, and featured products  
**Products Page** — Sidebar filters (search, category, price range), paginated product grid  
**Auth Page** — Animated tab switcher for Login / Register / Forgot Password  
**Admin Dashboard** — Manage users (toggle roles), manage products (add / delete)

---

## 🚀 Features

### Backend (10 Capstone Objectives — 500pts)
| # | Objective | Points |
|---|-----------|--------|
| 1 | Welcome Email with Nodemailer | 50 |
| 2 | Duplicate Key Error Handling | 50 |
| 3 | Password Hashing with bcrypt (Mongoose pre-hook) | 50 |
| 4 | Forget Password & Reset Password via email | 50 |
| 5 | Fix Admin Route Security Bug | 50 |
| 6 | Admin Update User Roles (controller + repo + route) | 50 |
| 7 | Product Search, Filter & Pagination | 50 |
| 8 | Fix Review Delete + Recalculate Rating | 50 |
| 9 | Order Placement (controller + repo) | 50 |

### Frontend
- 🏠 Home page — animated hero, feature cards, category grid, featured products
- 🛍️ Products page — keyword search, category & price filter, pagination
- 📦 Product detail — image gallery, qty selector, add-to-cart, star reviews
- 🛒 Cart — qty controls, persistent in `localStorage`, order summary
- 🔐 Auth — Login / Register / Forgot Password / Reset Password flow
- 👤 Profile — update name/email, change password, my orders table
- 💳 Checkout — shipping form, order placement, auto-clears cart
- 👑 Admin Dashboard — user role management, product add/delete

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Frontend** | React 18 + Vite |
| **State** | Redux Toolkit |
| **Routing** | React Router v6 |
| **Auth** | JWT + HttpOnly Cookies |
| **Email** | Nodemailer (Gmail SMTP) |
| **Styling** | Vanilla CSS — glassmorphism dark-mode |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`)
- Gmail account with an **App Password** (for email features)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/MoreNewApp.git
cd MoreNewApp
```

### 2. Set up environment variables
```bash
cp .env.example backend/config/uat.env
# Then edit backend/config/uat.env with your values
```

### 3. Install dependencies
```bash
# Root (backend)
npm install

# Frontend
cd frontend && npm install
```

### 4. Start the servers

**Terminal 1 — Backend** (port 4000):
```bash
npm run dev
```

**Terminal 2 — Frontend** (port 5173):
```bash
cd frontend && npm run dev
```

Open → **http://localhost:5173**

---

## 🔑 Environment Variables

Copy `.env.example` to `backend/config/uat.env` and fill in:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: `4000`) |
| `mongoURI` | MongoDB connection string |
| `JWT_Secret` | Secret key for JWT signing |
| `JWT_Expire` | JWT expiry (e.g. `1d`) |
| `COOKIE_EXPIRES_IN` | Cookie expiry in days |
| `STORFLEET_SMPT_MAIL` | Gmail address for sending emails |
| `STORFLEET_SMPT_MAIL_PASSWORD` | Gmail App Password |
| `SMPT_SERVICE` | Mail service (`gmail`) |

> ⚠️ **Never commit your real `uat.env` file.** It is excluded by `.gitignore`.

---

## 📁 Project Structure

```
MoreNewApp/
├── backend/
│   ├── config/
│   │   └── uat.env          ← (gitignored — use .env.example)
│   ├── middlewares/         ← auth, error handler
│   ├── src/
│   │   ├── user/            ← controller, model, routes, repository
│   │   ├── product/         ← controller, model, routes, repository
│   │   └── order/           ← controller, model, routes, repository
│   ├── utils/               ← emails, sendToken, errorHandler
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/      ← Navbar, Footer, ProductCard
│   │   ├── pages/           ← all page components
│   │   ├── redux/           ← store + 4 slices (user/product/cart/order)
│   │   ├── App.jsx          ← routes + protected routes
│   │   └── main.jsx
│   └── vite.config.js       ← proxy: /api → localhost:4000
│
├── .env.example             ← copy to backend/config/uat.env
├── .gitignore
└── README.md
```

---

## 📋 API Routes

### User
| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/storefleet/user/signup` | Public |
| POST | `/api/storefleet/user/login` | Public |
| POST | `/api/storefleet/user/password/forget` | Public |
| PUT | `/api/storefleet/user/password/reset/:token` | Public |
| GET | `/api/storefleet/user/logout` | User |
| GET | `/api/storefleet/user/details` | User |
| PUT | `/api/storefleet/user/profile/update` | User |
| PUT | `/api/storefleet/user/password/update` | User |
| GET | `/api/storefleet/user/admin/allusers` | Admin |
| PUT | `/api/storefleet/user/admin/update/:id` | Admin |
| DELETE | `/api/storefleet/user/admin/delete/:id` | Admin |

### Product
| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/storefleet/product/products` | Public |
| GET | `/api/storefleet/product/products/:id` | Public |
| PUT | `/api/storefleet/product/rate/:id` | User |
| DELETE | `/api/storefleet/product/review/delete` | User |
| POST | `/api/storefleet/product/admin/add` | Admin |
| PUT | `/api/storefleet/product/admin/update/:id` | Admin |
| DELETE | `/api/storefleet/product/admin/delete/:id` | Admin |

### Order
| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/storefleet/order/new` | User |
| GET | `/api/storefleet/order/myorders` | User |

---

## 📄 License

MIT — feel free to use this project as a learning reference.
