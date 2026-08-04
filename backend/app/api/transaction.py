from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
)
from app.services.transaction_service import (
    create_transaction,
    get_transactions,
    delete_transaction,
)

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Temporary user_id = 1
# Later we'll extract it from the JWT.
USER_ID = 1


@router.post(
    "/",
    response_model=TransactionResponse,
)
def add_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
):
    return create_transaction(
        db,
        transaction,
        USER_ID,
    )


@router.get(
    "/",
    response_model=list[TransactionResponse],
)
def list_transactions(
    db: Session = Depends(get_db),
):
    return get_transactions(
        db,
        USER_ID,
    )


@router.delete("/{transaction_id}")
def remove_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = delete_transaction(
        db,
        transaction_id,
        USER_ID,
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )

    return {
        "message": "Transaction deleted successfully"
    }