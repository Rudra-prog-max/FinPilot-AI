import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.services.transaction_service import (
    create_transaction,
    get_transactions,
    update_transaction,
    delete_transaction,
)
from app.services.budget_service import (
    create_budget,
    get_budgets,
    delete_budget,
)
from app.schemas.transaction import TransactionCreate
from app.schemas.budget import BudgetCreate
from app.services.auth_service import register_user, authenticate_user
from app.schemas.user import UserRegister


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False,
    )
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def seed_users(db):
    user_a = User(
        full_name="User A",
        email="a@example.com",
        hashed_password="hash-a",
    )
    user_b = User(
        full_name="User B",
        email="b@example.com",
        hashed_password="hash-b",
    )
    db.add_all([user_a, user_b])
    db.commit()
    db.refresh(user_a)
    db.refresh(user_b)
    return user_a, user_b


def test_transactions_are_isolated_by_user(db):
    user_a, user_b = seed_users(db)

    create_transaction(
        db,
        TransactionCreate(
            title="Private A",
            amount=100,
            type="expense",
            category="Food",
        ),
        user_a.id,
    )

    create_transaction(
        db,
        TransactionCreate(
            title="Private B",
            amount=900,
            type="expense",
            category="Travel",
        ),
        user_b.id,
    )

    assert [t.title for t in get_transactions(db, user_a.id)] == ["Private A"]
    assert [t.title for t in get_transactions(db, user_b.id)] == ["Private B"]


def test_transaction_update_and_delete_require_owner(db):
    user_a, user_b = seed_users(db)

    transaction = create_transaction(
        db,
        TransactionCreate(
            title="Owner Only",
            amount=100,
            type="expense",
            category="Food",
        ),
        user_a.id,
    )

    assert update_transaction(
        db,
        transaction.id,
        TransactionCreate(
            title="Blocked",
            amount=999,
            type="expense",
            category="Other",
        ),
        user_b.id,
    ) is None

    assert delete_transaction(
        db,
        transaction.id,
        user_b.id,
    ) is None

    assert get_transactions(db, user_a.id)[0].title == "Owner Only"


def test_budgets_are_isolated_by_user(db):
    user_a, user_b = seed_users(db)

    create_budget(
        db,
        BudgetCreate(category="Food", monthly_limit=500),
        user_a.id,
    )
    create_budget(
        db,
        BudgetCreate(category="Food", monthly_limit=1000),
        user_b.id,
    )

    assert len(get_budgets(db, user_a.id)) == 1
    assert get_budgets(db, user_a.id)[0].monthly_limit == 500
    assert get_budgets(db, user_b.id)[0].monthly_limit == 1000


def test_budget_delete_requires_owner(db):
    user_a, user_b = seed_users(db)

    budget = create_budget(
        db,
        BudgetCreate(category="Food", monthly_limit=500),
        user_a.id,
    )

    assert delete_budget(db, budget.id, user_b.id) is None
    assert len(get_budgets(db, user_a.id)) == 1


def test_auth_register_and_login(db):
    registered = register_user(
        db,
        UserRegister(
            full_name="Auth User",
            email="auth@example.com",
            password="strong-password",
        ),
    )

    assert registered is not None
    assert registered.hashed_password != "strong-password"

    assert authenticate_user(
        db,
        "auth@example.com",
        "strong-password",
    ).id == registered.id

    assert authenticate_user(
        db,
        "auth@example.com",
        "wrong-password",
    ) is None
