from datetime import datetime

from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate


def create_budget(db: Session, budget: BudgetCreate, user_id: int):
    new_budget = Budget(
        category=budget.category.strip(),
        monthly_limit=budget.monthly_limit,
        user_id=user_id,
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget


def get_budgets(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()


def delete_budget(db: Session, budget_id: int, user_id: int):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == user_id)
        .first()
    )
    if not budget:
        return None
    db.delete(budget)
    db.commit()
    return budget


def get_budget_analysis(db: Session, user_id: int):
    now = datetime.now()
    start = datetime(now.year, now.month, 1)
    end = datetime(now.year + 1, 1, 1) if now.month == 12 else datetime(now.year, now.month + 1, 1)

    budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
    result = []

    for budget in budgets:
        spent = (
            db.query(Transaction)
            .filter(
                Transaction.user_id == user_id,
                Transaction.category == budget.category,
                Transaction.type == "expense",
                Transaction.created_at >= start,
                Transaction.created_at < end,
            )
            .with_entities(Transaction.amount)
            .all()
        )
        spent_total = sum(amount for (amount,) in spent)
        percentage = (spent_total / budget.monthly_limit) * 100 if budget.monthly_limit > 0 else 0

        result.append({
            "category": budget.category,
            "limit": budget.monthly_limit,
            "spent": spent_total,
            "remaining": budget.monthly_limit - spent_total,
            "percentage": round(percentage, 2),
        })

    return result
