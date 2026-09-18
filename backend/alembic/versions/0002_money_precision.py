"""Use fixed precision numeric types for financial values.

Revision ID: 0002
Revises: 0001
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("transactions") as batch_op:
        batch_op.alter_column(
            "amount",
            existing_type=sa.Float(),
            type_=sa.Numeric(14, 2),
            existing_nullable=False,
        )

    with op.batch_alter_table("budgets") as batch_op:
        batch_op.alter_column(
            "monthly_limit",
            existing_type=sa.Float(),
            type_=sa.Numeric(14, 2),
            existing_nullable=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("budgets") as batch_op:
        batch_op.alter_column(
            "monthly_limit",
            existing_type=sa.Numeric(14, 2),
            type_=sa.Float(),
            existing_nullable=False,
        )

    with op.batch_alter_table("transactions") as batch_op:
        batch_op.alter_column(
            "amount",
            existing_type=sa.Numeric(14, 2),
            type_=sa.Float(),
            existing_nullable=False,
        )
