from pydantic import BaseModel, Field


class BudgetCreate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    monthly_limit: float = Field(gt=0)


class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: float
    user_id: int

    class Config:
        from_attributes = True


class BudgetAnalysisResponse(BaseModel):
    category: str
    limit: float
    spent: float
    remaining: float
    percentage: float
