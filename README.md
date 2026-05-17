# Smart Leads Dashboard

> A production-ready Lead Management Dashboard built with the MERN stack + TypeScript, featuring real-time filtering, RBAC, CSV export, and dark mode.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Auth** | JWT + bcrypt, register/login/logout, protected routes |
| **Leads CRUD** | Create, view, edit, delete with full validation |
| **Filtering** | Status, source, debounced search, sort — all combined |
| **Pagination** | Server-side pagination with metadata (page, total, hasNext…) |
| **CSV Export** | Exports current filtered dataset |
| **RBAC** | Admin (full access) vs SalesUser (no delete) |
| **Dark Mode** | System preference + manual toggle with persistence |
| **Loading States** | Skeleton loaders for all async sections |
| **Error States** | Graceful error UI with retry |
| **Empty States** | Contextual messages for filtered vs empty data |
| **Docker** | Compose setup with MongoDB, backend, nginx frontend |

---

## 🏗️ Architecture

```
smart-leads-dashboard/
├── backend/                  # Node.js + Express + TypeScript
│   └── src/
│       ├── constants/        # Shared constants (statuses, sources, etc.)
│       ├── controllers/      # Thin HTTP handlers
│       ├── middleware/        # Auth (JWT), validation, error handling
│       ├── models/            # Mongoose schemas (User, Lead)
│       ├── repositories/      # MongoDB query layer
│       ├── routes/            # Express routers
│       ├── scripts/           # Seed script
│       ├── services/          # Business logic
│       ├── types/             # Shared TypeScript types
│       ├── utils/             # Error helpers
│       ├── validators/        # express-validator chains
│       └── server.ts          # App entry point
│
├── frontend/                 # React + Vite + TypeScript + TailwindCSS
│   └── src/
│       ├── components/
│       │   ├── dashboard/     # StatCard, RecentLeads
│       │   ├── layout/        # Sidebar, Topbar, AppLayout, ProtectedRoute
│       │   ├── leads/         # LeadTable, LeadForm, LeadFiltersBar, LeadDetail
│       │   └── ui/            # Button, FormFields, Modal, Badge, Pagination, Skeleton, States
│       ├── constants/         # Frontend constants
│       ├── context/           # AuthContext, ThemeContext
│       ├── hooks/             # useLeads, useLeadFilters, useDebounce, CRUD mutations
│       ├── lib/               # Axios instance with interceptors
│       ├── pages/             # auth/, dashboard/, leads/, NotFoundPage
│       ├── services/          # API functions (authService, leadsService)
│       ├── types/             # TypeScript interfaces
│       └── utils/             # cn(), format.ts
│
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Local Development

**1. Clone & setup backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev          # Starts on :5000
```

**2. Seed demo data (optional)**
```bash
npm run seed
```

**3. Setup frontend**
```bash
cd frontend
npm install
npm run dev          # Starts on :5173
```

### Demo Credentials (after seeding)
| Role | Email | Password |
|---|---|---|
| **Admin** | admin@smartleads.dev | Admin@1234 |
| **Sales User** | sales@smartleads.dev | Sales@1234 |

---

## 🐳 Docker Deployment

```bash
cp .env.example .env
# Set JWT_SECRET to a strong random string
docker compose up --build -d
```

- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## 🔌 API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Get JWT token |
| GET | `/auth/me` | Auth | Current user |

### Leads
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/leads` | Auth | List with filters & pagination |
| GET | `/leads/:id` | Auth | Single lead |
| POST | `/leads` | Auth | Create lead |
| PUT | `/leads/:id` | Auth | Full update |
| PATCH | `/leads/:id` | Auth | Partial update |
| DELETE | `/leads/:id` | **Admin** | Delete lead |
| GET | `/leads/export/csv` | Auth | CSV export |

#### Query Parameters (GET /leads)
```
?page=1&limit=10&search=alice&status=New&source=Website&sort=latest
```

#### Response Envelope
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

---

## 🛡️ Security

- Helmet for HTTP headers
- Rate limiting (100 req / 15 min per IP)
- JWT expiry (configurable, default 7 days)
- bcrypt password hashing (12 rounds)
- CORS restricted to `FRONTEND_URL`
- Input validation on both frontend (Zod) and backend (express-validator)
- Docker runs backend as non-root user

---

## 📄 License

MIT
