from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    amount: float = Field(..., gt=0, le=100_000_000)
    type: Literal["income", "expense"]
    category: str = Field(..., min_length=1, max_length=80)


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: float
    type: str
    category: str
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)
