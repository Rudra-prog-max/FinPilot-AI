from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.transaction import Transaction
from app.models.user import User
from app.core.dependencies import get_current_user


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



@router.get("/summary")
def dashboard_summary(
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
    current_user: User = Depends(get_current_user),
):

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
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