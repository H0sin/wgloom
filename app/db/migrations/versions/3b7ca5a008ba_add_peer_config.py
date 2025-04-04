"""add peer config

Revision ID: 3b7ca5a008ba
Revises: 53582d82108f
Create Date: 2025-03-23 17:05:56.787089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3b7ca5a008ba'
down_revision: Union[str, None] = '53582d82108f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('peers', 'token',
               existing_type=sa.VARCHAR(length=64),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('peers', 'token',
               existing_type=sa.VARCHAR(length=64),
               nullable=False)
    # ### end Alembic commands ###
