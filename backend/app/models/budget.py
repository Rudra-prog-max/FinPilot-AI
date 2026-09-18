from sqlalchemy import Column, ForeignKey, Index, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (
        Index("ix_budgets_user_category", "user_id", "category"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    monthly_limit = Column(Numeric(14, 2), nullable=False)
    user = relationship("User", back_populates="budgets")
