from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.transaction import router as transaction_router
from app.api.dashboard import router as dashboard_router
from app.api.insights import router as insights_router
from app.api.budget import router as budget_router
from app.api.analytics import router as analytics_router
from app.api.ai import router as ai_router
from app.database.init_db import init_db


app = FastAPI(title=settings.APP_NAME)

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
