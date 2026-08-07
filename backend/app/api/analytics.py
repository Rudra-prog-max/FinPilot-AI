from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import SessionLocal
from app.models.transaction import Transaction
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/monthly")
def monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    income = {}
    expense = {}

    for t in transactions:
        month = t.created_at.strftime("%b")

        if t.type == "income":
            income[month] = income.get(month, 0) + t.amount
        else:
            expense[month] = expense.get(month, 0) + t.amount

    months = sorted(set(income.keys()) | set(expense.keys()))

    return [
        {
            "month": month,
            "income": income.get(month, 0),
            "expense": expense.get(month, 0),
        }
        for month in months
    ]


@router.get("/categories")
def category_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(
            Transaction.category,
            func.sum(Transaction.amount),
        )
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
        )
        .group_by(Transaction.category)
        .all()
    )

    return [
        {
            "category": category,
            "amount": amount,
        }
        for category, amount in rows
    ]