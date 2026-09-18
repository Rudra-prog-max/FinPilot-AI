from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    type: Literal["income", "expense"]
    category: str = Field(min_length=1, max_length=50)


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    type: str
    category: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
