from app.database.base import Base
from app.database.session import engine

# Import every model before creating metadata.
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget


def init_db():
    Base.metadata.create_all(bind=engine)
