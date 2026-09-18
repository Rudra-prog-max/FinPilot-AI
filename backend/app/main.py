import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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

app = FastAPI(title=settings.APP_NAME, version=settings.API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health", tags=["System"])
def health_check():
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
