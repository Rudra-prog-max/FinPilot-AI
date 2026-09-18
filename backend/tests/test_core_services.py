from datetime import datetime

import pytest
from pydantic import ValidationError

from app.models.budget import Budget
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from app.schemas.user import UserRegister
from app.services.ai_service import get_financial_context
from app.services.auth_service import authenticate_user, register_user
from app.services.budget_service import get_budget_analysis
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from fastapi.security import HTTPAuthorizationCredentials
from app.services.transaction_service import (
    create_transaction,
    delete_transaction,
    get_transactions,
    update_transaction,
)


def make_transaction(
    db,
    user_id,
    title,
    amount,
    transaction_type,
    category,
    created_at,
):
    transaction = Transaction(
        title=title,
        amount=amount,
        type=transaction_type,
        category=category,
        user_id=user_id,
        created_at=created_at,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def test_registration_hashes_password_and_login_works(db_session):
    registration = UserRegister(
        full_name="Rudra User",
        email="rudra@example.com",
        password="SecurePass1",
    )

    user = register_user(db_session, registration)

    assert user is not None
    assert user.hashed_password != registration.password
    assert authenticate_user(
        db_session,
        registration.email,
        registration.password,
    ).id == user.id
    assert authenticate_user(
        db_session,
        registration.email,
        "WrongPass1",
    ) is None


def test_duplicate_registration_is_rejected(db_session):
    registration = UserRegister(
        full_name="Rudra User",
        email="rudra@example.com",
        password="SecurePass1",
    )

    assert register_user(db_session, registration) is not None
    assert register_user(db_session, registration) is None


def test_invalid_transaction_input_is_rejected():
    with pytest.raises(ValidationError):
        TransactionCreate(
            title="Dinner",
            amount=0,
            type="expense",
            category="Food",
        )

    with pytest.raises(ValidationError):
        TransactionCreate(
            title="Dinner",
            amount=100,
            type="invalid",
            category="Food",
        )


def test_transaction_queries_are_user_scoped(db_session, users, current_month):
    user_a, user_b = users

    own = make_transaction(
        db_session,
        user_a.id,
        "Own expense",
        100,
        "expense",
        "Food",
        current_month,
    )
    make_transaction(
        db_session,
        user_b.id,
        "Other user expense",
        999,
        "expense",
        "Food",
        current_month,
    )

    transactions = get_transactions(db_session, user_a.id)

    assert [item.id for item in transactions] == [own.id]
    assert transactions[0].user_id == user_a.id


def test_user_cannot_update_or_delete_another_users_transaction(
    db_session,
    users,
    current_month,
):
    user_a, user_b = users

    transaction = make_transaction(
        db_session,
        user_a.id,
        "Private expense",
        100,
        "expense",
        "Food",
        current_month,
    )

    payload = TransactionCreate(
        title="Tampered",
        amount=500,
        type="expense",
        category="Shopping",
    )

    assert (
        update_transaction(
            db_session,
            transaction.id,
            payload,
            user_b.id,
        )
        is None
    )

    assert (
        delete_transaction(
            db_session,
            transaction.id,
            user_b.id,
        )
        is None
    )

    db_session.refresh(transaction)
    assert transaction.title == "Private expense"
    assert transaction.amount == 100


def test_budget_analysis_uses_current_month_only(
    db_session,
    users,
    current_month,
):
    user_a, _ = users

    budget = Budget(
        user_id=user_a.id,
        category="Food",
        monthly_limit=500,
    )
    db_session.add(budget)
    db_session.commit()

    make_transaction(
        db_session,
        user_a.id,
        "This month",
        200,
        "expense",
        "Food",
        current_month,
    )

    previous_month = datetime(
        current_month.year - 1,
        current_month.month,
        15,
        12,
        0,
        0,
    )
    make_transaction(
        db_session,
        user_a.id,
        "Historical",
        700,
        "expense",
        "Food",
        previous_month,
    )

    result = get_budget_analysis(db_session, user_a.id)

    assert len(result) == 1
    assert result[0]["spent"] == 200
    assert result[0]["remaining"] == 300
    assert result[0]["percentage"] == 40


def test_ai_context_is_user_scoped_and_calculates_totals(
    db_session,
    users,
    current_month,
):
    user_a, user_b = users

    make_transaction(
        db_session,
        user_a.id,
        "Salary",
        1000,
        "income",
        "Income",
        current_month,
    )
    make_transaction(
        db_session,
        user_a.id,
        "Food",
        250,
        "expense",
        "Food",
        current_month,
    )
    make_transaction(
        db_session,
        user_b.id,
        "Other salary",
        5000,
        "income",
        "Income",
        current_month,
    )

    context = get_financial_context(db_session, user_a.id)

    assert context["total_income"] == 1000
    assert context["total_expense"] == 250
    assert context["balance"] == 750
    assert context["category_totals"] == {"food": 250}


def test_password_policy_is_enforced():
    with pytest.raises(ValidationError):
        UserRegister(
            full_name="Valid Name",
            email="valid@example.com",
            password="weakpassword",
        )

    with pytest.raises(ValidationError):
        UserRegister(
            full_name="Valid Name",
            email="valid@example.com",
            password="NoNumberA",
        )

    with pytest.raises(ValidationError):
        UserRegister(
            full_name="Valid Name",
            email="valid@example.com",
            password="nonumber1",
        )



def test_session_version_invalidates_old_token(db_session):
    user = User(full_name="Session User", email="session@example.com", hashed_password="hash")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token({"sub": str(user.id), "ver": user.session_version})
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    assert get_current_user(credentials, db_session).id == user.id

    user.session_version += 1
    db_session.commit()

    with pytest.raises(Exception):
        get_current_user(credentials, db_session)


def test_money_values_preserve_cents(db_session, users, current_month):
    user_a, _ = users

    make_transaction(
        db_session,
        user_a.id,
        "Coffee",
        19.95,
        "expense",
        "Food",
        current_month,
    )
    make_transaction(
        db_session,
        user_a.id,
        "Snack",
        0.05,
        "expense",
        "Food",
        current_month,
    )

    transactions = get_transactions(db_session, user_a.id)
    total = sum(item.amount for item in transactions)

    assert str(total) == "20.00"
