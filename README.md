# FinPilot-AI

FinPilot-AI is a full-stack personal finance application built with React + TypeScript and FastAPI. It provides authenticated, user-scoped transaction tracking, budgeting, analytics, and a deterministic finance assistant.

## Production architecture

- **Frontend:** React, TypeScript, Vite, React Router, Recharts, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Pydantic v2
- **Authentication:** JWT access tokens with issuer, expiry, and server-side session versioning
- **Database:** SQLite for local development; PostgreSQL for production
- **Migrations:** Alembic
- **Rate limiting:** SlowAPI; Redis is recommended for multi-instance production
- **Testing:** pytest + GitHub Actions
- **Security:** user-scoped database access, password hashing, CORS allowlist, trusted-host protection, security headers, generic 500 responses

## Local development

### Backend

```powershell
cd backend
venv\Scripts\activate
python -m pip install -r requirements.txt
python -m pip install -r requirements-dev.txt
python -m uvicorn app.main:app --reload
```

Backend:
- API: http://127.0.0.1:8000
- Health: http://127.0.0.1:8000/health
- OpenAPI: http://127.0.0.1:8000/docs

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

### Verification

```powershell
cd backend
python -m pytest -q

cd ..\frontend
npm run build
npm run lint
```

## Production database

Use PostgreSQL in production and disable automatic table creation:

```text
DATABASE_URL=postgresql://...
AUTO_CREATE_DB=false
```

Run migrations before starting the API:

```powershell
cd backend
alembic upgrade head
```

Never point a production database at a local SQLite file.

## Production security configuration

Set a cryptographically random, private `SECRET_KEY`. Do not commit `.env` files or credentials.

Use explicit production values for:

- `ENVIRONMENT=production`
- `CORS_ORIGINS=https://your-frontend.example`
- `TRUSTED_HOSTS=api.your-domain.example`
- `AUTO_CREATE_DB=false`
- `RATE_LIMIT_ENABLED=true`
- `RATE_LIMIT_STORAGE_URI=redis://...`
- `JWT_ISSUER=finpilot-api`

Serve the API and frontend over HTTPS. HSTS is enabled by the API when requests arrive over HTTPS.

## Data isolation

Every authenticated financial query is scoped to the current user's ID. The AI service receives financial context for that user only. Never add cross-user analytics, administrative queries, debug dumps, or logs containing financial records without an explicit privacy review.

## Financial-data handling

FinPilot-AI is a personal finance tracking and analysis tool. Its automated insights are informational and should not be treated as professional financial, tax, legal, or investment advice.

Avoid placing passwords, access tokens, payment credentials, or unnecessary financial details in logs, screenshots, support tickets, or client-side analytics.

## Deployment checklist

Before public launch:

1. Provision PostgreSQL.
2. Run `alembic upgrade head`.
3. Configure Redis-backed rate limiting for multi-instance deployments.
4. Set production CORS and trusted hosts.
5. Generate and store a strong secret outside source control.
6. Enable HTTPS.
7. Configure database backups and restore testing.
8. Configure application/error monitoring without collecting sensitive financial payloads.
9. Review privacy policy, terms, and financial disclaimer with the intended jurisdiction in mind.
10. Run backend tests, frontend lint, and production build in CI.
11. Verify registration, login, logout, token expiry, transaction isolation, budget calculations, and AI user isolation in a staging environment.
12. Only then point the public domain at production.

## Repository workflow

The `production-readiness` branch is used for hardening and release preparation. Keep `main` protected until the final staging verification and review are complete.
