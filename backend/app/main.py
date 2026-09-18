import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.transaction import router as transaction_router
from app.api.dashboard import router as dashboard_router
from app.api.insights import router as insights_router
from app.api.budget import router as budget_router
from app.api.analytics import router as analytics_router
from app.api.ai import router as ai_router
from app.database.init_db import init_db


logger = logging.getLogger("finpilot")

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.RATE_LIMIT_DEFAULT],
    storage_uri=settings.RATE_LIMIT_STORAGE_URI,
    enabled=settings.RATE_LIMIT_ENABLED,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )

    return response


@app.on_event("startup")
def startup():
    if settings.AUTO_CREATE_DB:
        init_db()


@app.get("/health", tags=["System"])
@limiter.limit("30/minute")
def health_check(request: Request):
    return {"status": "ok", "service": settings.APP_NAME}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(
        "Unhandled API error on %s %s",
        request.method,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred."},
    )


app.include_router(auth_router)
app.include_router(transaction_router)
app.include_router(dashboard_router)
app.include_router(insights_router)
app.include_router(budget_router)
app.include_router(analytics_router)
app.include_router(ai_router)


@app.get("/")
def home():
    return {"message": "FinPilot API is running 🚀"}
