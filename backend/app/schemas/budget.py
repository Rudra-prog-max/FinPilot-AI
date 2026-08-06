from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float


class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: float
    user_id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float


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