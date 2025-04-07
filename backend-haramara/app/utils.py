from app.models import Locations
import base64
import os
import uuid
import re

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

def save_base64_image(base64_string, upload_folder):
    """
    Guarda una imagen en formato base64 en el sistema de archivos
    
    Args:
        base64_string (str): La imagen en formato base64 (data:image/png;base64,...)
        upload_folder (str): La carpeta donde se guardará la imagen
        
    Returns:
        str: La URL relativa de la imagen guardada
    """
    try:
        # Asegurarse de que la carpeta existe
        os.makedirs(upload_folder, exist_ok=True)
        
        # Extraer el formato y los datos de la cadena base64
        format_pattern = re.compile(r'data:image/(\w+);base64,(.+)')
        match = format_pattern.match(base64_string)
        
        if not match:
            return None
            
        image_format, image_data = match.groups()
        
        # Crear un nombre único para el archivo
        unique_filename = f"image_{uuid.uuid4().hex}.{image_format}"
        file_path = os.path.join(upload_folder, unique_filename)
        
        # Decodificar y guardar la imagen
        with open(file_path, 'wb') as f:
            f.write(base64.b64decode(image_data))
            
        # Obtener la URL relativa (ajustar según la estructura de carpetas)
        relative_path = file_path.split('/static/')[-1] if '/static/' in file_path else file_path
        url = f"/static/{relative_path}"
        
        return url
    except Exception as e:
        print(f"Error guardando imagen base64: {str(e)}")
        return None
