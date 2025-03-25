"""config peer table

Revision ID: ac34462f8fdf
Revises: 96a77bfc4089
Create Date: 2025-03-23 14:34:35.536946

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ac34462f8fdf'
down_revision: Union[str, None] = '96a77bfc4089'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('peers', 'name',
               existing_type=sa.VARCHAR(length=34),
               type_=sa.String(length=512),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('peers', 'name',
               existing_type=sa.String(length=512),
               type_=sa.VARCHAR(length=34),
               existing_nullable=True)
    # ### end Alembic commands ###
