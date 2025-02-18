import os

class Config:
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///" + os.path.join(basedir, "database.db"))

    SECRET_KEY = os.getenv("SECRET_KEY", "clave_por_defecto")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_clave_por_defecto")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
