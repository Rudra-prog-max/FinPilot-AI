from sqlalchemy import Column, ForeignKey, Integer, Numeric, String

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
        Numeric(14, 2),
        nullable=False,
    )
