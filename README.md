# Smart Leads Dashboard

> A production-ready Lead Management Dashboard built with the **MERN stack + TypeScript**, featuring JWT authentication, RBAC, real-time filtering, CSV export, and dark mode.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | [https://smart-leads-dashboard-xi.vercel.app](https://smart-leads-dashboard-xi.vercel.app) |
| **Backend API** | [https://smart-leads-dashboard-dj8r.onrender.com/api/health](https://smart-leads-dashboard-dj8r.onrender.com/api/health) |

### Demo Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@smartleads.dev` | `Admin@1234` |
| **Sales User** | `sales@smartleads.dev` | `Sales@1234` |

> **Note:** The Render free tier spins down after inactivity. The first request may take ~30 seconds to cold-start.

---

## ✨ Features

| Category | Details |
|---|---|
| **Authentication** | JWT + bcrypt, register/login/logout, protected routes, auth middleware |
| **Leads CRUD** | Create, view, edit, delete with full input validation |
| **Advanced Filtering** | Filter by status, source, debounced search by name/email, sort by latest/oldest — all filters work together |
| **Pagination** | Server-side pagination with `skip`/`limit`, metadata (page, total, totalPages, hasNext, hasPrev) |
| **CSV Export** | Exports the current filtered dataset as a downloadable `.csv` file |
| **RBAC** | Admin (full access) vs SalesUser (no delete permission) |
| **Dark Mode** | System preference detection + manual toggle with localStorage persistence |
| **Loading States** | Skeleton loaders for all async sections |
| **Error States** | Graceful error UI with retry buttons |
| **Empty States** | Contextual messages for filtered vs empty datasets |
| **Docker** | Multi-stage Dockerfiles + Compose setup with MongoDB, backend, and nginx frontend |

---

## 🏗️ Architecture

```
Browser → React SPA (Vite + TailwindCSS) → /api proxy → Express API → MongoDB
              ↓                                             ↓
         React Query                                   Mongoose ODMs
         Zod + RHF                                     bcryptjs + JWT
```

### Project Structure

```
smart-leads-dashboard/
├── backend/                      # Node.js + Express + TypeScript
│   ├── Dockerfile                # Multi-stage build (Node Alpine)
│   ├── .env.example              # Environment variable template
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── constants/            # Shared constants (statuses, sources, HTTP codes)
│       ├── controllers/          # Thin HTTP handlers (authController, leadController)
│       ├── middleware/           # Auth (JWT verify + RBAC), validation runner
│       ├── models/               # Mongoose schemas (User, Lead)
│       ├── repositories/         # MongoDB query layer (leadRepository, userRepository)
│       ├── routes/               # Express routers (auth, leads)
│       ├── scripts/              # Database seed script (50 demo leads + 2 users)
│       ├── services/             # Business logic (authService, leadService)
│       ├── types/                # Shared TypeScript interfaces
│       ├── utils/                # AppError, asyncHandler, sendSuccess/sendError
│       ├── validators/           # express-validator chains
│       └── server.ts             # App entry point
│
├── frontend/                     # React + Vite + TypeScript + TailwindCSS
│   ├── Dockerfile                # Multi-stage build (Vite → nginx)
│   ├── nginx.conf                # SPA routing + API proxy
│   ├── package.json
│   ├── vite.config.ts            # Dev proxy: /api → :5000
│   ├── tailwind.config.js        # Brand colors, dark mode, animations
│   └── src/
│       ├── components/
│       │   ├── dashboard/        # StatCard, RecentLeads
│       │   ├── layout/           # Sidebar, Topbar, AppLayout, ProtectedRoute
│       │   ├── leads/            # LeadTable, LeadForm, LeadFiltersBar, LeadDetail
│       │   └── ui/               # Button, FormFields, Modal, Badge, Pagination, Skeleton, States
│       ├── constants/            # Frontend constants + API base URL
│       ├── context/              # AuthContext, ThemeContext
│       ├── hooks/                # useLeads, useLeadFilters, useDebounce, CRUD mutations
│       ├── lib/                  # Axios instance with JWT interceptor
│       ├── pages/                # auth/ (Login, Register), dashboard/, leads/, NotFoundPage
│       ├── services/             # API functions (authService, leadsService)
│       ├── types/                # TypeScript interfaces (Lead, User, PaginationMeta, etc.)
│       └── utils/                # cn(), formatDate(), getInitials(), truncate()
│
├── docker-compose.yml            # MongoDB + backend + nginx frontend
├── .env.example                  # Docker environment template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **MongoDB** (local installation or [MongoDB Atlas](https://cloud.mongodb.com))
- **npm** 9+

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/JAY20921/Smart-Leads-Dashboard.git
cd Smart-Leads-Dashboard
```

**2. Setup backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev          # Starts on http://localhost:5000
```

**3. Seed demo data (optional but recommended)**
```bash
npm run seed
```

**4. Setup frontend (new terminal)**
```bash
cd frontend
npm install
npm run dev          # Starts on http://localhost:5173
```

Open **http://localhost:5173** and log in with the demo credentials above.

---

## 🐳 Docker Deployment

```bash
cp .env.example .env
# Edit .env — set JWT_SECRET to a strong random string

docker compose up --build -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

To stop: `docker compose down`
To stop and remove data: `docker compose down -v`

---

## 🔌 API Reference

All routes are prefixed with `/api`. Authentication is via `Authorization: Bearer <token>` header.

### Auth Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Authenticate and get JWT token |
| `GET` | `/api/auth/me` | Auth | Get current user profile |

### Lead Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/leads` | Auth | List leads with filters & pagination |
| `GET` | `/api/leads/:id` | Auth | Get single lead details |
| `POST` | `/api/leads` | Auth | Create a new lead |
| `PUT` | `/api/leads/:id` | Auth | Full update |
| `PATCH` | `/api/leads/:id` | Auth | Partial update |
| `DELETE` | `/api/leads/:id` | **Admin only** | Delete a lead |
| `GET` | `/api/leads/export/csv` | Auth | Export filtered leads as CSV |

### Health Check

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Server status and uptime |

### Query Parameters (`GET /api/leads`)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page (max 100) |
| `search` | string | — | Search by name or email (debounced) |
| `status` | string | — | Filter: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | — | Filter: `Website`, `Instagram`, `Referral` |
| `sort` | string | `latest` | Sort: `latest` or `oldest` |

**Example:**
```
GET /api/leads?page=1&limit=10&search=alice&status=Qualified&source=Website&sort=latest
```

### Response Envelope

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Leads fetched",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🛡️ Security

| Measure | Implementation |
|---|---|
| **HTTP Headers** | Helmet.js for secure HTTP headers |
| **Rate Limiting** | 100 requests per 15 minutes per IP |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT** | Configurable expiry (default 7 days), secret via env var |
| **CORS** | Restricted to `FRONTEND_URL` environment variable |
| **Input Validation** | Frontend: Zod + react-hook-form; Backend: express-validator |
| **Password Safety** | `select: false` on password field — never leaked in API responses |
| **Regex Escaping** | Search queries are escaped to prevent ReDoS attacks |
| **Docker Security** | Backend runs as non-root user in production container |

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.x | Type safety |
| Vite | Build tool & dev server |
| TailwindCSS 4 | Utility-first styling |
| React Query (TanStack) | Server state management & caching |
| React Hook Form + Zod | Form handling & validation |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| Axios | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 | Runtime |
| Express.js | Web framework |
| TypeScript 5.x | Type safety |
| MongoDB 7.0 | Database |
| Mongoose | ODM with schema validation |
| JSON Web Token | Stateless authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Helmet | HTTP security headers |
| express-rate-limit | Brute-force protection |
| Morgan | Request logging (dev) |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization (multi-stage builds) |
| Docker Compose | Multi-service orchestration |
| Nginx | Static file serving & SPA routing |

---

## 📁 Environment Variables

### Backend (`backend/.env.example`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MONGODB_URI` | `mongodb://localhost:27017/smart_leads` | MongoDB connection string |
| `JWT_SECRET` | — | **Required.** Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `BCRYPT_SALT_ROUNDS` | `12` | Password hashing rounds |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

### Frontend (Vercel / `.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Backend API base URL (set for production) |

---

## 📄 License

MIT
