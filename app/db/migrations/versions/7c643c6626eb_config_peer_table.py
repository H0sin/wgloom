"""config peer table

Revision ID: 7c643c6626eb
Revises: ac34462f8fdf
Create Date: 2025-03-23 14:52:08.593846

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c643c6626eb'
down_revision: Union[str, None] = 'ac34462f8fdf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('peers', sa.Column('mtu', sa.Integer(), nullable=True))
    op.drop_column('peers', 'mut')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('peers', sa.Column('mut', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('peers', 'mtu')
    # ### end Alembic commands ###
