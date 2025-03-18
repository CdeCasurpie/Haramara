from app.models import Locations

def get_post_data(request, required_fields=None):
    try:
        data = request.get_json()
        if not isinstance(data, dict):
            return None, ["Invalid JSON format"]
    except Exception as e:
        print(e)
        return None, ["Invalid JSON"]

    missing = []
    if required_fields:
        for field in required_fields:
            if field not in data or data[field] in [None, "", [], {}]:
                missing.append(field)

    if missing:
        return None, missing

    return data, []


def search_location(new_location):
    """
    Busca una ubicacion en la base de datos
    """
    location = Locations.query.filter_by(address=new_location.address, country=new_location.country, comunity=new_location.comunity, province=new_location.province, postal_code=new_location.postal_code).first()
    return location
