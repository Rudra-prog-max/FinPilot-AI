from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = request.message.strip().lower()

    if not message:
        return {
            "response": "Please enter a message so I can help you."
        }

    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id)
        .all()
    )

    total_income = sum(
        t.amount for t in transactions
        if t.type == "income"
    )

    total_expense = sum(
        t.amount for t in transactions
        if t.type == "expense"
    )

    balance = total_income - total_expense

    category_totals = {}

    for transaction in transactions:
        if transaction.type == "expense":
            category = transaction.category.lower()

            category_totals[category] = (
                category_totals.get(category, 0)
                + transaction.amount
            )

    top_category = None

    if category_totals:
        top_category = max(
            category_totals,
            key=category_totals.get,
        )

    # Calculate budget usage
    budget_status = []

    for budget in budgets:
        category = budget.category.lower()
        spent = category_totals.get(category, 0)

        percentage = (
            (spent / budget.monthly_limit) * 100
            if budget.monthly_limit > 0
            else 0
        )

        budget_status.append({
            "category": budget.category,
            "limit": budget.monthly_limit,
            "spent": spent,
            "percentage": percentage,
        })

    savings_rate = (
        (balance / total_income) * 100
        if total_income > 0
        else 0
    )

    # Spending analysis
    if "spending" in message or "expense" in message:
        response = (
            f"Here's your current spending overview, "
            f"{current_user.full_name}:\n\n"
            f"Total income: ₹{total_income:,.0f}\n"
            f"Total expenses: ₹{total_expense:,.0f}\n"
            f"Net balance: ₹{balance:,.0f}\n"
        )

        if top_category:
            response += (
                f"\nYour highest spending category is "
                f"{top_category.capitalize()}."
            )

    # Savings analysis
    elif "save" in message or "saving" in message:
        response = (
            f"Your current savings rate is "
            f"{savings_rate:.1f}%.\n\n"
        )

        if savings_rate >= 30:
            response += (
                "That's a strong savings rate. Keep maintaining "
                "your current spending discipline."
            )
        elif savings_rate >= 15:
            response += (
                "You're saving a reasonable portion of your income. "
                "Try to gradually increase your savings rate."
            )
        else:
            response += (
                "Your savings rate is relatively low. "
                "Review your largest expense categories and "
                "look for areas where spending can be reduced."
            )

    # Financial health
    elif "health" in message or "financial health" in message:
        response = (
            f"Financial health overview for "
            f"{current_user.full_name}:\n\n"
            f"Income: ₹{total_income:,.0f}\n"
            f"Expenses: ₹{total_expense:,.0f}\n"
            f"Balance: ₹{balance:,.0f}\n"
            f"Savings rate: {savings_rate:.1f}%"
        )

        if balance < 0:
            response += (
                "\n\n⚠️ Your expenses currently exceed your income. "
                "Reducing discretionary spending should be a priority."
            )
        elif savings_rate >= 30:
            response += (
                "\n\nExcellent! Your current savings rate indicates "
                "strong financial discipline."
            )
        else:
            response += (
                "\n\nYour finances are currently positive. "
                "Continue monitoring your spending and savings."
            )

    # Budget analysis
    elif "budget" in message or "over budget" in message:
        response = (
            f"Here's your budget overview, "
            f"{current_user.full_name}:\n\n"
        )

        if not budget_status:
            response += (
                "You don't have any budgets configured yet. "
                "Create a budget for your spending categories "
                "to start tracking your limits."
            )
        else:
            for budget in budget_status:
                response += (
                    f"{budget['category'].capitalize()}: "
                    f"₹{budget['spent']:,.0f} / "
                    f"₹{budget['limit']:,.0f} "
                    f"({budget['percentage']:.1f}%)\n"
                )

            over_budget = [
                budget
                for budget in budget_status
                if budget["percentage"] > 100
            ]

            if over_budget:
                response += (
                    "\n⚠️ You are over budget in: "
                    + ", ".join(
                        budget["category"].capitalize()
                        for budget in over_budget
                    )
                    + "."
                )
            else:
                response += (
                    "\n✅ You're currently within all "
                    "configured category budgets."
                )

    # Category analysis
    elif (
        "category" in message
        or "categories" in message
        or "breakdown" in message
        or "biggest expense" in message
    ):
        if not category_totals:
            response = (
                "You don't have any expense data yet, "
                "so I can't provide a category breakdown."
            )
        else:
            response = (
                f"Here's your spending breakdown, "
                f"{current_user.full_name}:\n\n"
            )

            sorted_categories = sorted(
                category_totals.items(),
                key=lambda item: item[1],
                reverse=True,
            )

            for category, amount in sorted_categories:
                percentage = (
                    (amount / total_expense) * 100
                    if total_expense > 0
                    else 0
                )

                response += (
                    f"• {category.capitalize()}: "
                    f"₹{amount:,.0f} "
                    f"({percentage:.1f}%)\n"
                )

    # General fallback
    else:
        response = (
            f"Hi {current_user.full_name}! 👋\n\n"
            "I can help you analyze your finances, including:\n\n"
            "• Spending and expenses\n"
            "• Savings\n"
            "• Financial health\n"
            "• Budget planning\n"
            "• Spending categories\n\n"
            "Try asking me something like:\n"
            "\"Analyze my spending\"\n"
            "\"How can I save more?\"\n"
            "\"Am I over budget?\"\n"
            "\"Show my spending breakdown\""
        )

    return {
        "response": response
    }