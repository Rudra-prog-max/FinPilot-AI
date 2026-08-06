from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.insight_service import generate_insights


router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



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
