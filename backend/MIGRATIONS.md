# FinPilot-AI Database Migrations

FinPilot-AI uses Alembic for versioned schema changes.

## Local development

For an existing local database created by the current application, keep AUTO_CREATE_DB=true.

For a new database managed entirely by migrations:

    cd backend
    alembic upgrade head

Then set:

    AUTO_CREATE_DB=false

## Production

Production should use a PostgreSQL DATABASE_URL and:

    AUTO_CREATE_DB=false
    alembic upgrade head

Do not use automatic table creation in production.

Alembic's autogenerate feature creates candidate migrations by comparing the application metadata with the database schema. Review every generated migration before applying it.
