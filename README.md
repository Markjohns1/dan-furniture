# Dan Classic Furniture - E-commerce System

A complete mobile-first e-commerce management system for Dan Classic Furniture, specializing in sofasets, chairs, dining sets, and office chairs.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Security](#security)
10. [Deployment](#deployment)
11. [Default Credentials](#default-credentials)

---

## Overview

Dan Classic Furniture is a mobile-first e-commerce platform designed for a furniture business in Kenya. The system supports:

- Customer-facing product catalog and shopping cart
- WhatsApp-based order placement
- Admin dashboard for product and order management
- Role-based access control (Admin and Customer roles)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 + Font Awesome 6 |
| Backend | FastAPI (Python 3.10+) |
| Database | SQLite (development) / PostgreSQL (production) |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcrypt via passlib |
| Rate Limiting | slowapi |

---

## Features

### Customer Features
- Browse products by category (Sofasets, Chairs, Dining Sets, Office Chairs)
- Search and filter products
- View product details with image gallery
- Add to cart with color selection
- Checkout via WhatsApp
- User registration and login
- View order history

### Admin Features
- Dashboard with sales statistics
- Product management (CRUD operations)
- Category management
- Order management with status updates
- Customer list
- Low stock alerts
- Revenue analytics

### Technical Features
- Mobile-first responsive design
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Image upload with validation
- SQL injection protection (ORM-based queries)

---

## Project Structure

```
dan-classic-furniture/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Environment configuration
│   │   ├── database.py        # Database connection
│   │   ├── main.py            # FastAPI application entry
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── routers/           # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   └── dashboard.py
│   │   └── utils/             # Utilities
│   │       ├── auth.py        # JWT and password utilities
│   │       └── uploads.py     # File upload handling
│   ├── uploads/               # Uploaded images
│   ├── .env                   # Environment variables (not in git)
│   ├── requirements.txt
│   └── seed.py                # Database seeder
├── frontend/
│   ├── src/
│   │   ├── api/               # API service layer
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # Header, BottomNav
│   │   │   ├── product/       # ProductCard
│   │   │   └── ui/            # Loading, WhatsAppButton
│   │   ├── context/           # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── auth/          # Login, Register
│   │   │   └── customer/      # Home, Products, Cart, Profile
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind CSS
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── README.md
└── start-backend.bat
```

---

## Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example below)
# See Configuration section

# Initialize database with admin user and categories
python seed.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

---

## Configuration

Create a `.env` file in the `backend/` directory:

```env
# Security - CHANGE THESE FOR PRODUCTION
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
# Development (SQLite):
DATABASE_URL=sqlite:///./dan_furniture.db
# Production (PostgreSQL):
# DATABASE_URL=postgresql://user:password@host:5432/database

# WhatsApp - Replace with actual number
WHATSAPP_NUMBER=254700000000

# Uploads
MAX_FILE_SIZE_MB=5
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp

# CORS - Update for production
FRONTEND_URL=http://localhost:5173
```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| SECRET_KEY | JWT signing key (min 32 chars) | dev-secret-key |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token lifetime | 30 |
| REFRESH_TOKEN_EXPIRE_DAYS | Refresh token lifetime | 7 |
| DATABASE_URL | Database connection string | sqlite:///./dan_furniture.db |
| WHATSAPP_NUMBER | WhatsApp number for orders | 254700000000 |
| MAX_FILE_SIZE_MB | Max upload file size | 5 |
| ALLOWED_EXTENSIONS | Allowed image extensions | jpg,jpeg,png,webp |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

---

## Running the Application

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation (Swagger) | http://localhost:8000/docs |
| API Documentation (ReDoc) | http://localhost:8000/redoc |

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get tokens |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/me | Get current user profile |
| PUT | /api/auth/me | Update user profile |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (with filters) |
| GET | /api/products/{id} | Get single product |
| POST | /api/products | Create product (Admin) |
| PUT | /api/products/{id} | Update product (Admin) |
| DELETE | /api/products/{id} | Delete product (Admin) |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/new-arrivals | Get new arrivals |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category (Admin) |
| PUT | /api/categories/{id} | Update category (Admin) |
| DELETE | /api/categories/{id} | Delete category (Admin) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders | List orders (user's own or all for admin) |
| GET | /api/orders/{id} | Get order details |
| PUT | /api/orders/{id}/status | Update order status (Admin) |
| POST | /api/orders/{id}/cancel | Cancel order |

### Admin Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Get dashboard statistics |
| GET | /api/admin/analytics/revenue-by-category | Revenue breakdown |
| GET | /api/admin/analytics/top-products | Best selling products |
| GET | /api/admin/analytics/low-stock | Low stock alerts |
| GET | /api/admin/analytics/recent-orders | Recent orders list |
| GET | /api/admin/customers | Customer list |

---

## Security

### Implemented Security Measures

1. **Password Security**
   - Passwords hashed using bcrypt
   - Minimum password length enforced

2. **JWT Authentication**
   - Short-lived access tokens (30 minutes)
   - Refresh tokens for session management (7 days)
   - Token type validation (access vs refresh)

3. **SQL Injection Protection**
   - All queries use SQLAlchemy ORM
   - Parameterized queries by default

4. **Rate Limiting**
   - API rate limiting via slowapi
   - Prevents brute force attacks

5. **CORS**
   - Restricted to specified frontend origins
   - Credentials support enabled

6. **File Upload Security**
   - File extension validation
   - File size limits
   - Image optimization

7. **Role-Based Access Control**
   - Admin and Customer roles
   - Protected admin endpoints

### Production Security Checklist

- [ ] Generate new SECRET_KEY (use: `openssl rand -hex 32`)
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Update CORS origins to production domain
- [ ] Set secure cookie settings
- [ ] Enable logging and monitoring

---

## Deployment

### Backend Deployment (Railway, Render, or Fly.io)

1. Create a PostgreSQL database
2. Set environment variables in hosting platform
3. Deploy from GitHub repository
4. Run database migrations

Example for Railway:
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

### Frontend Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Set build directory to `frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL` = your backend URL

### Post-Deployment Steps

1. Update backend FRONTEND_URL in environment variables
2. Update frontend API base URL
3. Test all functionality
4. Set up domain and SSL

---

## Default Credentials

### Admin Account
- Email: admin@danfurniture.co.ke
- Password: admin123

### Product Categories
The seeder creates these categories:
1. Sofasets
2. Chairs
3. Dining Sets
4. Office Chairs

---

## License

This project is proprietary software developed for Dan Classic Furniture.

---

## Support

For technical support or questions, contact the development team.
