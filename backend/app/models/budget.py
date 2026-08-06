from sqlalchemy import Column, ForeignKey, Integer, String, Float

from app.database.base import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    monthly_limit = Column(
        Float,
        nullable=False,
    )