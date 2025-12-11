# Dan Classic Furniture - E-commerce System

Premium furniture e-commerce system for Dan Classic Furniture, specializing in sofasets and chairs.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT tokens

## Quick Start

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
python seed.py  # Create admin user & categories
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Credentials
- **Admin**: admin@danfurniture.co.ke / admin123

## Features
- 📱 Mobile-first responsive design
- 🛋️ Product catalog with filters & search
- 🛒 Shopping cart (localStorage)
- 📲 WhatsApp order integration
- 👤 Customer registration & login
- 📊 Admin dashboard with analytics
- 📦 Order management with status tracking
- ⚠️ Low stock alerts

## API Docs
Visit http://localhost:8000/docs when backend is running.
