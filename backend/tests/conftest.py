from datetime import datetime

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.user import User


@pytest.fixture()
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def users(db_session):
    user_a = User(
        full_name="User A",
        email="a@example.com",
        hashed_password="hashed-a",
    )
    user_b = User(
        full_name="User B",
        email="b@example.com",
        hashed_password="hashed-b",
    )

    db_session.add_all([user_a, user_b])
    db_session.commit()
    db_session.refresh(user_a)
    db_session.refresh(user_b)

    return user_a, user_b


@pytest.fixture()
def current_month():
    now = datetime.now()
    return datetime(now.year, now.month, 15, 12, 0, 0)
