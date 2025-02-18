from flask_jwt_extended import create_access_token
from app.models import Users, Companies

def get_post_data(request, required_fields=None):
    """
    Obtiene los datos enviados por el cliente y revisa si los campos requeridos están presentes
    """

    data = {}

    # obtiene json
    try:
        data = request.get_json()
    except Exception as e:
        print(e)
        return None, []
    

    # Campos requeridos
    missing = []
    if required_fields:
        for field in required_fields:
            if field not in data:
                missing.append(field)
    if missing:
        return None, missing

    return data, []


def is_valid_email(email):
    """
    Revisa si un email es válido
    """
    if '@' in email and '.' in email:
        return True
    return False


def search_user(email, password):
    """
    Busca un usuario en la base de datos
    """

    user = Users.query.filter_by(email=email).first()

    if user and user.password == password:
        return user

    return None


def search_company(email, password):
    """
    Busca una empresa en la base de datos
    """

    # TODO: implementar search_company

    company = Companies.query.filter_by(email=email).first()

    if company and company.password == password:
        return company

    return None


def generate_token(user_id, type):
    """
    Genera un token
    """
    payload = {
        'user_id': user_id,
        'type': type
    }

    return create_access_token(identity=payload)
