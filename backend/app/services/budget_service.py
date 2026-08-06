from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate


def create_budget(
    db: Session,
    budget: BudgetCreate,
    user_id: int,
):
    new_budget = Budget(
        category=budget.category,
        monthly_limit=budget.monthly_limit,
        user_id=user_id,
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget



def get_budgets(
    db: Session,
    user_id: int,
):
    return (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id
        )
        .all()
    )



def delete_budget(
    db: Session,
    budget_id: int,
    user_id: int,
):
    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == user_id,
        )
        .first()
    )

    if not budget:
        return None

    db.delete(budget)
    db.commit()

    return budget



def get_budget_analysis(
    db: Session,
    user_id: int,
):
    budgets = (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id
        )
        .all()
    )

    result = []

    for budget in budgets:

        transactions = (
            db.query(Transaction)
            .filter(
                Transaction.user_id == user_id,
                Transaction.category == budget.category,
                Transaction.type == "expense",
            )
            .all()
        )

        spent = sum(
            transaction.amount
            for transaction in transactions
        )

        remaining = (
            budget.monthly_limit - spent
        )

        percentage = (
            (spent / budget.monthly_limit) * 100
            if budget.monthly_limit > 0
            else 0
        )

        result.append(
            {
                "category": budget.category,
                "limit": budget.monthly_limit,
                "spent": spent,
                "remaining": remaining,
                "percentage": round(
                    percentage,
                    2,
                ),
            }
        )

    return result