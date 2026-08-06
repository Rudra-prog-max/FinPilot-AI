from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate


def create_transaction(
    db: Session,
    transaction: TransactionCreate,
    user_id: int,
):
    new_transaction = Transaction(
        title=transaction.title,
        amount=transaction.amount,
        type=transaction.type,
        category=transaction.category,
        user_id=user_id,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


def get_transactions(
    db: Session,
    user_id: int,
):
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )


def delete_transaction(
    db: Session,
    transaction_id: int,
    user_id: int,
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id,
        )
        .first()
    )

    if not transaction:
        return None

    db.delete(transaction)
    db.commit()

    return transaction


def update_transaction(
    db: Session,
    transaction_id: int,
    transaction_data: TransactionCreate,
    user_id: int,
):

    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id,
        )
        .first()
    )


    if not transaction:
        return None


    transaction.title = transaction_data.title
    transaction.amount = transaction_data.amount
    transaction.type = transaction_data.type
    transaction.category = transaction_data.category


    db.commit()
    db.refresh(transaction)


    return transaction