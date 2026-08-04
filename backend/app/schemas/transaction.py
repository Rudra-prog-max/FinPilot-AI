from pydantic import BaseModel
from datetime import datetime


class TransactionCreate(BaseModel):
    title: str
    amount: float
    type: str
    category: str


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    type: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True