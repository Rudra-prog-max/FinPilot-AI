from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal

from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
    BudgetAnalysisResponse,
)

from app.services.budget_service import (
    create_budget,
    get_budgets,
    delete_budget,
    get_budget_analysis,
)

from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/budget",
    tags=["Budget"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()



@router.post(
    "/",
    response_model=BudgetResponse,
)
def add_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_budget(
        db,
        budget,
        current_user.id,
    )



@router.get(
    "/",
    response_model=list[BudgetResponse],
)
def list_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_budgets(
        db,
        current_user.id,
    )



@router.delete("/{budget_id}")
def remove_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = delete_budget(
        db,
        budget_id,
        current_user.id,
    )

    if budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found",
        )

    return {
        "message": "Budget deleted successfully"
    }



@router.get(
    "/analysis",
    response_model=list[BudgetAnalysisResponse],
)
def budget_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_budget_analysis(
        db,
        current_user.id,
    )