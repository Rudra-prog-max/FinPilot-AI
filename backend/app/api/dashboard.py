from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.transaction import Transaction

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


USER_ID = 1


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == USER_ID)
        .all()
    )

    income = sum(
        t.amount
        for t in transactions
        if t.type == "income"
    )

    expense = sum(
        t.amount
        for t in transactions
        if t.type == "expense"
    )

    balance = income - expense

    return {
        "income": income,
        "expense": expense,
        "balance": balance,
        "transactions": len(transactions),
    }
@router.get("/expense-categories")
def expense_categories(
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == USER_ID,
            Transaction.type == "expense",
        )
        .all()
    )

    category_totals = {}

    for transaction in transactions:
        category = transaction.category

        if category not in category_totals:
            category_totals[category] = 0

        category_totals[category] += transaction.amount

    return [
        {
            "name": category,
            "value": amount,
        }
        for category, amount in category_totals.items()
    ]