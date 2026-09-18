from decimal import Decimal

from pydantic import BaseModel, Field


class BudgetCreate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    monthly_limit: Decimal = Field(gt=0, max_digits=14, decimal_places=2)


class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: Decimal
    user_id: int

    class Config:
        from_attributes = True


class BudgetAnalysisResponse(BaseModel):
    category: str
    limit: Decimal
    spent: Decimal
    remaining: Decimal
    percentage: Decimal
