# FinPilot-AI Production Deployment Runbook

## Required production services

- React frontend served over HTTPS
- FastAPI API served behind HTTPS
- PostgreSQL database
- Redis for distributed rate limiting
- Secret storage supplied by the hosting platform

## Environment

Backend production baseline:

```text
ENVIRONMENT=production
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>
SECRET_KEY=<random-secret>
JWT_ISSUER=finpilot-api
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=https://<frontend-domain>
TRUSTED_HOSTS=<api-domain>
AUTO_CREATE_DB=false
RATE_LIMIT_ENABLED=true
RATE_LIMIT_STORAGE_URI=redis://<redis-host>:6379/0
```

Frontend:

```text
VITE_API_URL=https://<api-domain>
```

Do not commit actual values.

## Release sequence

1. Deploy the API to a staging environment.
2. Apply Alembic migrations with `alembic upgrade head`.
3. Start the API with a production ASGI process.
4. Verify `/health`.
5. Deploy the frontend with the production API URL.
6. Run smoke tests against staging.
7. Verify HTTPS, CORS, trusted hosts, authentication, logout, and protected routes.
8. Verify a user cannot read or mutate another user's transactions.
9. Verify budget calculations use the current month.
10. Verify AI responses use only the authenticated user's financial context.
11. Configure database backups and test restoration.
12. Enable monitoring and alerting.
13. Promote the tested build to production.

## Migration safety

Do not use `Base.metadata.create_all()` for production schema management. Production startup must keep `AUTO_CREATE_DB=false`; schema changes are applied through versioned Alembic migrations.

For an existing database that predates Alembic, establish its migration baseline carefully before applying later migrations. Do not blindly run migrations against an existing database without first inspecting its schema and backup.

## Rate limiting

The development default is in-memory storage. Production with more than one API process or instance should use Redis so rate-limit state is shared.

Recommended protected surfaces:

- Login: 5 requests/minute
- Registration: 3 requests/hour
- AI chat: 20 requests/minute
- General API default: 120 requests/minute

Tune these limits after observing legitimate traffic patterns.

## Operational security

- Never expose `SECRET_KEY`, database credentials, or Redis credentials.
- Do not log authorization headers.
- Do not log raw AI prompts or complete transaction histories by default.
- Restrict database access to the API's network identity.
- Keep dependencies patched.
- Use HTTPS-only public endpoints.
- Keep staging and production credentials separate.
- Review backup access and retention.
- Test session revocation after logout.

## Smoke-test checklist

- [ ] Register a new account
- [ ] Login
- [ ] Refresh the browser while authenticated
- [ ] Create a transaction
- [ ] Edit the transaction
- [ ] Delete the transaction
- [ ] Confirm another account cannot access it
- [ ] Create a budget
- [ ] Verify current-month budget calculation
- [ ] Open analytics
- [ ] Ask the AI assistant a finance question
- [ ] Logout
- [ ] Confirm the previous token is rejected
- [ ] Confirm protected pages redirect after authentication expires
