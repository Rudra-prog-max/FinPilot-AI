from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User

from app.services.ai_service import (
    get_financial_context,
    detect_intent,
    analyze_spending,
    analyze_current_month,
    analyze_previous_month,
    analyze_monthly_comparison,
    analyze_savings,
    analyze_health,
    analyze_budget,
    analyze_categories,
    analyze_affordability,
    analyze_cut_spending,
    analyze_income,
    analyze_balance,
    general_response,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = request.message.strip()

    if not message:
        return {
            "response": "Please enter a message so I can help you."
        }

    if len(message) > 1000:
        return {
            "response": "Please keep your message under 1000 characters."
        }

    context = get_financial_context(
        db,
        current_user.id,
    )

    intent = detect_intent(message)


    if intent == "spending":
        response = analyze_spending(
            context,
            message,
        )

    elif intent == "current_month":
        response = analyze_current_month(
            context,
        )

    elif intent == "previous_month":
        response = analyze_previous_month(
            context,
        )

    elif intent == "month_comparison":
        response = analyze_monthly_comparison(
            context,
        )

    elif intent == "savings":
        response = analyze_savings(
            context,
        )

    elif intent == "health":
        response = analyze_health(
            context,
        )

    elif intent == "budget":
        response = analyze_budget(
            context,
            message,
        )

    elif intent == "categories":
        response = analyze_categories(
            context,
            message,
        )

    elif intent == "affordability":
        response = analyze_affordability(
            context,
            message,
        )

    elif intent == "cut_spending":
        response = analyze_cut_spending(
            context,
        )

    elif intent == "income":
        response = analyze_income(
            context,
        )

    elif intent == "balance":
        response = analyze_balance(
            context,
        )

    else:
        response = general_response()

    return {
        "response": response
    }