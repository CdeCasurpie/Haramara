from flask_jwt_extended import create_access_token
from app.models import db
from app.models import Users, Companies, Locations, TemporalCompanies, TemporalLocations
from datetime import timedelta


def is_valid_email(email):
    """
    Revisa si un email es válido
    """
    if '@' in email and '.' in email:
        return True
    return False


def search_user(email):
    """
    Busca un usuario en la base de datos
    """

    user = Users.query.filter_by(email=email).first()

    return user


def search_company(email):
    """
    Busca una empresa en la base de datos
    """

    company = Companies.query.filter_by(email=email).first()
    return company


def generate_token(user_id, type):
    """
    Genera un token que expira en 1 día
    """
    return create_access_token(
        identity=str(user_id), 
        additional_claims={'type': type},
        expires_delta=timedelta(days=1)  # Token expira en 1 día
    )