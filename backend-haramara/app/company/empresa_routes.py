from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.models import Companies, Locations, db
from app.auth.decorators import login_business_required
import os
import bcrypt

empresa_bp = Blueprint('empresa_bp', __name__)

# EMPRESA =====================================================================

@empresa_bp.route('/company/profile', methods=['GET'])
@login_business_required
def get_company_profile():
    """
    Obtiene los datos del perfil de la empresa autenticada
    """
    company_id = get_jwt_identity()
    
    try:
        # Buscar la empresa por ID
        company = Companies.query.get(company_id)
        
        if not company:
            return jsonify({
                "success": False,
                "message": "Empresa no encontrada"
            }), 404
        
        # Buscar los datos de ubicación
        location = Locations.query.get(company.id_location)
        
        if not location:
            return jsonify({
                "success": False,
                "message": "Datos de ubicación no encontrados"
            }), 404
        
        # Preparar la respuesta
        company_data = {
            "id": company.id,
            "name": company.name,
            "email": company.email,
            "description": company.description,
            "url_image_logo": company.url_image_logo,
            "url_image_portada": company.url_image_portada,
            "name_representative": company.name_representative,
            "last_name_representative": company.last_name_representative,
            "is_safe": company.is_safe,
            "has_languages": company.has_languages
        }
        
        location_data = {
            "id": location.id,
            "address": location.address,
            "country": location.country,
            "comunity": location.comunity,
            "province": location.province,
            "postal_code": location.postal_code
        }
        
        return jsonify({
            "success": True,
            "company": company_data,
            "location": location_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener perfil: {str(e)}"
        }), 500


@empresa_bp.route('/company/profile', methods=['PUT'])
@login_business_required
def update_company_profile():
    """
    Actualiza los datos del perfil de la empresa autenticada
    """
    company_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Validar que se recibieron los datos
        if not data:
            return jsonify({
                "success": False,
                "message": "No se recibieron datos para actualizar"
            }), 400
        
        # Verificar si existen ambos objetos (company y location)
        company_data = data.get('company', {})
        location_data = data.get('location', {})
        
        # Buscar la empresa por ID
        company = Companies.query.get(company_id)
        
        if not company:
            return jsonify({
                "success": False,
                "message": "Empresa no encontrada"
            }), 404
        
        # Actualizar datos de la empresa
        if 'name' in company_data:
            company.name = company_data['name']
        if 'email' in company_data:
            company.email = company_data['email']
        if 'description' in company_data:
            company.description = company_data['description']
        if 'name_representative' in company_data:
            company.name_representative = company_data['name_representative']
        if 'last_name_representative' in company_data:
            company.last_name_representative = company_data['last_name_representative']
        if 'is_safe' in company_data:
            company.is_safe = company_data['is_safe']
        if 'has_languages' in company_data:
            company.has_languages = company_data['has_languages']
        
        # Si se proporciona una nueva contraseña, actualizarla
        if 'password' in company_data and company_data['password']:
            hashed_password = bcrypt.hashpw(company_data['password'].encode('utf-8'), bcrypt.gensalt())
            company.password = hashed_password.decode('utf-8')
        
        # Buscar y actualizar los datos de ubicación
        location = Locations.query.get(company.id_location)
        
        if not location:
            return jsonify({
                "success": False,
                "message": "Datos de ubicación no encontrados"
            }), 404
        
        # Actualizar campos de ubicación
        if 'address' in location_data:
            location.address = location_data['address']
        if 'country' in location_data:
            location.country = location_data['country']
        if 'comunity' in location_data:
            location.comunity = location_data['comunity']
        if 'province' in location_data:
            location.province = location_data['province']
        if 'postal_code' in location_data:
            location.postal_code = location_data['postal_code']
        
        # Guardar cambios en la base de datos
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Perfil actualizado correctamente"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error al actualizar perfil: {str(e)}"
        }), 500


@empresa_bp.route('/company/upload-images', methods=['POST'])
@login_business_required
def upload_company_images():
    """
    Sube imágenes de logo y/o portada para la empresa
    """
    company_id = get_jwt_identity()
    
    try:
        # Verificar que se enviaron archivos
        if 'logo' not in request.files and 'cover' not in request.files:
            return jsonify({
                "success": False,
                "message": "No se recibieron archivos para subir"
            }), 400
        
        # Buscar la empresa por ID
        company = Companies.query.get(company_id)
        
        if not company:
            return jsonify({
                "success": False,
                "message": "Empresa no encontrada"
            }), 404
        
        # Configuración de directorio para imágenes
        upload_folder = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'companies', str(company_id))
        os.makedirs(upload_folder, exist_ok=True)
        
        response_data = {}
        
        # Procesar imagen de logo si se proporciona
        if 'logo' in request.files:
            logo_file = request.files['logo']
            if logo_file.filename != '':
                # Guardar el archivo con un nombre seguro
                logo_filename = secure_filename(logo_file.filename)
                logo_path = os.path.join(upload_folder, f"logo_{logo_filename}")
                logo_file.save(logo_path)
                
                # Obtener la URL relativa para almacenar en la base de datos
                logo_url = f"/static/uploads/companies/{company_id}/logo_{logo_filename}"
                company.url_image_logo = logo_url
                response_data['logo_url'] = logo_url
        
        # Procesar imagen de portada si se proporciona
        if 'cover' in request.files:
            cover_file = request.files['cover']
            if cover_file.filename != '':
                # Guardar el archivo con un nombre seguro
                cover_filename = secure_filename(cover_file.filename)
                cover_path = os.path.join(upload_folder, f"cover_{cover_filename}")
                cover_file.save(cover_path)
                
                # Obtener la URL relativa para almacenar en la base de datos
                cover_url = f"/static/uploads/companies/{company_id}/cover_{cover_filename}"
                company.url_image_portada = cover_url
                response_data['cover_url'] = cover_url
        
        # Guardar cambios en la base de datos
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Imágenes actualizadas correctamente",
            "data": response_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error al subir imágenes: {str(e)}"
        }), 500