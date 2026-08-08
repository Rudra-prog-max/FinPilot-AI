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
        .filter(
            Transaction.user_id == current_user.id
        )
        .all()
    )

    monthly_data = {}

    for transaction in transactions:
        month_key = transaction.created_at.strftime(
            "%Y-%m"
        )

        if month_key not in monthly_data:
            monthly_data[month_key] = {
                "income": 0,
                "expense": 0,
            }

        if transaction.type == "income":
            monthly_data[month_key]["income"] += (
                transaction.amount
            )
        else:
            monthly_data[month_key]["expense"] += (
                transaction.amount
            )

    months = sorted(monthly_data.keys())

    return [
        {
            "month": month,
            "income": monthly_data[month]["income"],
            "expense": monthly_data[month]["expense"],
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