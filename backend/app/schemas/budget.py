from pydantic import BaseModel, ConfigDict, Field


class BudgetCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=80)
    monthly_limit: float = Field(..., gt=0, le=100_000_000)


class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: float
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class BudgetAnalysisResponse(BaseModel):
    category: str
    limit: float
    spent: float
    remaining: float
    percentage: float
