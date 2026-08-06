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
    update_transaction,
)
from app.core.dependencies import get_current_user
from app.models.user import User


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



@router.post(
    "/",
    response_model=TransactionResponse,
)
def add_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return create_transaction(
        db,
        transaction,
        current_user.id,
    )



@router.get(
    "/",
    response_model=list[TransactionResponse],
)
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_transactions(
        db,
        current_user.id,
    )



@router.put(
    "/{transaction_id}",
    response_model=TransactionResponse,
)
def edit_transaction(
    transaction_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    updated_transaction = update_transaction(
        db,
        transaction_id,
        transaction,
        current_user.id,
    )


    if updated_transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )


    return updated_transaction


@router.delete("/{transaction_id}")
def remove_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    transaction = delete_transaction(
        db,
        transaction_id,
        current_user.id,
    )


    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )


    return {
        "message": "Transaction deleted successfully"
    }