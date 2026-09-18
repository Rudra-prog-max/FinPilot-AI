"""Add indexes for user-scoped financial queries.

Revision ID: 0004
Revises: 0003
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_transactions_user_created_at",
        "transactions",
        ["user_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_transactions_user_category",
        "transactions",
        ["user_id", "category"],
        unique=False,
    )
    op.create_index(
        "ix_budgets_user_category",
        "budgets",
        ["user_id", "category"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_budgets_user_category", table_name="budgets")
    op.drop_index("ix_transactions_user_category", table_name="transactions")
    op.drop_index("ix_transactions_user_created_at", table_name="transactions")
