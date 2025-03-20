from email.policy import default

from decouple import config
from dotenv import load_dotenv

load_dotenv()

# sql configuration
SQLALCHEMY_DATABASE_URL = config("SQLALCHEMY_DATABASE_URL", default="sqlite:///db.sqlite3")
SQLALCHEMY_POOL_SIZE = config("SQLALCHEMY_POOL_SIZE", cast=int, default=10)
SQLALCHEMY_MAX_OVERFLOW = config("SQLALCHEMY_MAX_OVERFLOW", cast=int, default=30)

DEBUG = config("DEBUG", default=False, cast=bool)
DOCS = config("DOCS", default=False, cast=bool)
REDOC = config("REDOC", default=False, cast=bool)

ALLOWED_ORIGINS = config("ALLOWED_ORIGINS", default="*").split(",")

# jwt
SECRET_KEY = config('SECRET_KEY', default="WG_LOOM_GENERETE")
ALGORITHM = config('ALGORITHM', default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', default=30, cast=int)


# interface
INTERFACE_DIRECTORY = config('INTERFACE_DIRECTORY',default='/etc/wireguard')