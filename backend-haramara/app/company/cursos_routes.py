from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, Locations, ImagesServices, ShiftActivities, Cupos, db, Courses
from app.auth.decorators import login_business_required

cursos_bp = Blueprint('cursos_bp', __name__)

# CURSOS ======================================================================

@cursos_bp.route('/company/courses', methods=['GET'])
@login_business_required
def get_courses():
    """
    Retorna todos los cursos de la empresa
    """
    company_id = get_jwt_identity()
    
    try:
        # Primero buscamos los servicios de la empresa
        services = Services.query.filter_by(company_id=company_id).all()
        service_ids = [service.id for service in services]
        
        # Luego buscamos los cursos asociados a esos servicios
        courses = Courses.query.filter(Courses.id_service.in_(service_ids)).all()
        
        # Preparamos los datos para la respuesta
        courses_data = []
        for course in courses:
            # Obtenemos la ubicación del curso
            location = Locations.query.get(course.id_ubicacion)
            
            # Preparamos los datos del curso
            course_data = {
                "id": course.id,
                "titulo": course.titulo,
                "price": course.price,
                "start_date": course.start_date.strftime('%Y-%m-%d'),
                "end_date": course.end_date.strftime('%Y-%m-%d'),
                "adittional_info": course.adittional_info,
                "details": course.details,
                "tags": course.tags,
                "location": {
                    "id": location.id,
                    "address": location.address,
                    "country": location.country,
                    "comunity": location.comunity,
                    "province": location.province,
                    "postal_code": location.postal_code
                }
            }
            courses_data.append(course_data)
        
        return jsonify({"success": True, "courses": courses_data}), 200
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error al obtener cursos: {str(e)}"}), 500

@cursos_bp.route('/company/courses/<int:id>', methods=['GET'])
def get_course(id):
    """
    Retorna un curso de la empresa y todos sus detalles
    """
    return jsonify({'message': 'not implemented yet'}), 501

@cursos_bp.route('/company/courses', methods=['POST'])
def create_course():
    """
    Crea un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501

@cursos_bp.route('/company/courses/<int:id>', methods=['PUT'])
def update_course(id):
    """
    Actualiza un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501