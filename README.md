# FinPilot-AI

FinPilot-AI is an AI-powered personal finance platform for tracking transactions, budgets, analytics, financial insights, and contextual AI assistance.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: SQLite for local development, PostgreSQL-ready for production
- Authentication: JWT with bcrypt password hashing

## Local development

### Backend

```powershell
cd backend
.envScriptsactivate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs  
Health: http://127.0.0.1:8000/health

Copy `backend/.env.example` to `backend/.env` and set a strong `SECRET_KEY`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from the environment.

## Production

Use PostgreSQL and set:

- `DATABASE_URL`
- `SECRET_KEY`
- `FRONTEND_URL`
- `VITE_API_BASE_URL`

A production Docker image is provided at `backend/Dockerfile`.

## Quality and security

The repository includes automated backend tests covering authentication and cross-user transaction/budget isolation. GitHub Actions also runs the backend test suite and frontend production build on pushes and pull requests to `main`.
