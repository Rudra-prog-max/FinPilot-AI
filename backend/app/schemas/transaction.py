from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    type: Literal["income", "expense"]
    category: str = Field(min_length=1, max_length=50)


class TransactionResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    type: str
    category: str
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)
