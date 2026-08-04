from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.database.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.api.transaction import router as transaction_router


app = FastAPI(title="FinPilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


app.include_router(auth_router)
app.include_router(transaction_router)


@app.get("/")
def home():
    return {"message": "FinPilot API is running 🚀"}