from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, Locations, ImagesServices, ShiftActivities, Cupos, db, Courses
from app.auth.decorators import login_business_required
from app.utils import *
import json
from datetime import datetime

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
            # Preparamos los datos del curso

            course_data = {
                "id": course.id,
                "titulo": course.titulo,
                "price": course.price,
                "start_date": course.start_date.strftime('%Y-%m-%d'),
                "end_date": course.end_date.strftime('%Y-%m-%d'),
                "adittional_info": course.adittional_info,
                "description": course.description,
                "tags": course.tags,
                "vacancies": course.vacancies,
                "min_age": course.min_age,
                "location": json.loads(course.ubicacion),
                "images": [],                
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
@login_business_required
def create_course():
    """
    Crea un curso
    """
    company_id = get_jwt_identity()
    data = request.get_json()

    try:
        required_fields = ["titulo", "price", "start_date", "end_date", "adittional_info", "description", "tags", "vacancies", "ubicacion"]
        data, missing = get_post_data(request, required_fields)
        if missing:
            return jsonify({"success": False, "message": f"Campos requeridos: {', '.join(missing)}"}), 400
        
        # verificiaciones de valores numericos
        try:
            data["price"] = float(data["price"])
            if data["price"] < 0:
                return jsonify({"success": False, "message": "El precio debe ser un número positivo"}), 400
        except ValueError:
            return jsonify({"success": False, "message": "El precio debe ser un número válido"}), 400

        try:
            data["vacancies"] = int(data["vacancies"])
            if data["vacancies"] < 0:
                return jsonify({"success": False, "message": "Las vacantes deben ser un número positivo"}), 400
        except ValueError:
            return jsonify({"success": False, "message": "Las vacantes deben ser un número válido"}), 400

        try:
            data["min_age"] = int(data["min_age"])
            if data["min_age"] < 0:
                return jsonify({"success": False, "message": "La edad mínima debe ser un número positivo"}), 400
        except ValueError:
            return jsonify({"success": False, "message": "La edad mínima debe ser un número válido"}), 400


        # verificamos que las fechas sean válidas
        try:
            data['start_date'] = datetime.strptime(data['start_date'], '%Y-%m-%d')
            data['end_date'] = datetime.strptime(data['end_date'], '%Y-%m-%d')
        except Exception as e:
            return jsonify({"success": False, "message": "Las fechas deben tener el formato 'YYYY-MM-DD'"}), 400
        


        with db.session.begin():
            #creamos el servicio
            service = Services(company_id = company_id)
            db.session.add(service)
            db.session.flush()

            #location
            ubicacion = json.dumps(data['ubicacion'])

            print("=====", data)

            # Creamos el curso
            course = Courses(
                titulo=data['titulo'],
                price=data['price'],
                start_date=data['start_date'],
                end_date=data['end_date'],
                adittional_info=data['adittional_info'],
                description=data['description'],
                tags=data['tags'],
                vacancies=data['vacancies'],
                ubicacion=ubicacion,
                id_service=service.id,
                min_age=data['min_age']
            )
            db.session.add(course)
            db.session.flush()

            #procesar imagenes si existen
            if 'images' in data and isinstance(data['images'], list):
                for image_data in data['images']:
                    if isinstance(image_data, dict) and 'url' in image_data:
                        image = ImagesServices(
                            url_image=image_data['url'],
                            id_service=service.id
                        )
                        db.session.add(image)
                        db.session.flush()

            return jsonify({"success": True, 
                            "message": "Curso creado exitosamente", 
                            "data": {"id": course.id, 
                                     "id_service": service.id,
                                       "titulo": course.titulo, 
                                       "price": course.price, 
                                       "start_date": course.start_date.strftime('%Y-%m-%d'), 
                                       "end_date": course.end_date.strftime('%Y-%m-%d'),
                                         "adittional_info": course.adittional_info, 
                                         "description": course.description,
                                        "tags": course.tags,
                                        "vacancies": course.vacancies,
                                        "ubicacion": json.loads(course.ubicacion),
                                        "min_age": course.min_age,
                                        "images": [],  
                                        }}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, 
                        "message": f"Error al crear curso: {str(e)}"}), 500 


@cursos_bp.route('/company/courses/<int:id>', methods=['PUT'])
def update_course(id):
    """
    Actualiza un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501