from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config, TestingConfig
from flask_jwt_extended import JWTManager

from app.auth import auth_bp
from app.client import client_bp
from app.company import company_bp
from app.payment import payment_bp

from app.models import *

def create_app(config_name='development'):
    app = Flask(__name__)

    if config_name == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(Config)


    # Inicializar la base de datos
    db.init_app(app)

    # Initialize JWT
    jwt = JWTManager(app)

    # Crear tablas en la base de datos (solo en desarrollo)
    with app.app_context():
        db.create_all()

    # Registrar blueprints o rutas
    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(payment_bp)

    return app
