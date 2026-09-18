from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.dependencies import get_current_user, get_db
from app.services.insight_service import generate_insights


router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"],
)




@router.get("/")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    insights = generate_insights(
        db,
        current_user.id,
    )

    return insights
