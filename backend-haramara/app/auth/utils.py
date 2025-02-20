from flask_jwt_extended import create_access_token
from app.models import Users, Companies, Locations, db

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

def search_location(new_location):
    """
    Busca una ubicacion en la base de datos
    """
    location = Locations.query.filter_by(address=new_location.address, country=new_location.country, comunity=new_location.comunity, province=new_location.province, postal_code=new_location.postal_code).first()
    return location

def generate_token(user_id, type):
    """
    Genera un token
    """
    payload = {
        'user_id': user_id,
        'type': type
    }

    return create_access_token(identity=payload)

