import os

class Config:
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///" + os.path.join(basedir, "database.db"))

    SECRET_KEY = os.getenv("SECRET_KEY", "clave_por_defecto")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_clave_por_defecto")
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = "None"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

