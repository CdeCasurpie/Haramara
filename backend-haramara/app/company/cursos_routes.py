from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Courses, Services, ImagesServices, ShiftCourses
from app.auth.decorators import login_business_required
from app.utils import *
import json
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from app.company.utils import verifications

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

            # Obtenemos las imagenes del curso
            service_id = course.id_service

            images = ImagesServices.query.filter_by(id_service=service_id).all()

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
                "images": [image.url_image for image in images]          
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
    data = request.form.to_dict()

    try:
        result = verifications(data)
        if result:
            return result
        
        with db.session.begin():
            #creamos el servicio
            service = Services(company_id = company_id)
            db.session.add(service)
            db.session.flush()

            # manejamos las imagenes

            # configurción de directorio de imagenes de un servicio
            upload_folder = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service.id))
            os.makedirs(upload_folder, exist_ok=True)

            images = request.files.getlist('images')

            image_paths = []

            for image in images:
                if image.filename != '':
                    # Guardar el archivo con un nombre seguro
                    image_filename = secure_filename(image.filename)
                    image_path = os.path.join(upload_folder, f"image_{image_filename}")
                    image.save(image_path)

                    # Obtener la URL relativa para almacenar en la base de datos
                    image_url = f"/static/uploads/services/{service.id}/image_{image_filename}"
                    image_paths.append(image_url)   


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
                ubicacion=data['ubicacion'],
                id_service=service.id,
                min_age=data['min_age']
            )
            db.session.add(course)
            db.session.flush()

            # Guardamos las imagenes en la base de datos
            for image_path in image_paths:
                image = ImagesServices(id_service=service.id, url_image=image_path)
                db.session.add(image)

            # creamos los turnos
            if data.get("turnos"):
                print("turnos", data["turnos"])

                turnos_list = json.loads(data["turnos"])
                for shift in turnos_list:
                    print("shift", shift)
                    # Convertimos los días a una cadena de 7 caracteres
                    frequency = ''.join(['1' if day else '0' for day in shift['frequency']])
                    new_shift = ShiftCourses(
                        id_course=course.id,
                        start_time=shift['start_time'],
                        end_time=shift['end_time'],
                        frequency=frequency,
                        free_vacancies=course.vacancies
                    )
                    db.session.add(new_shift)

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
                                        "images": image_paths
                                        }}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, 
                        "message": f"Error al crear curso: {str(e)}"}), 500 


@cursos_bp.route('/company/courses/<int:id>', methods=['PUT'])
@login_business_required
def update_course(id):
    """
    Actualiza un curso
    """

    company_id = get_jwt_identity()
    data = request.form.to_dict()

    try:

        result = verifications(data)
        if result:
            return result

        with db.session.begin():
            course = Courses.query.get(id)
            if not course:
                return jsonify({"success": False, "message": "Curso no encontrado"}), 404

            # Verificamos que el curso pertenezca a la empresa
            service = Services.query.get(course.id_service)
            print(service.company_id, company_id)
            if str(service.company_id) != str(company_id):
                return jsonify({"success": False, "message": "No tienes permisos para modificar este curso"}), 403
            
            course.titulo = data['titulo']
            course.price = data['price']
            course.start_date = data['start_date']
            course.end_date = data['end_date']
            course.adittional_info = data['adittional_info']
            course.description = data['description']
            course.tags = data['tags']
            course.vacancies = data['vacancies']
            course.ubicacion = data['ubicacion']
            course.min_age = data['min_age']

            # creamos los turnos
            if data.get("turnos"):
                print("turnos", data["turnos"])

                turnos_list = json.loads(data["turnos"])
                for shift in turnos_list:
                    print("shift", shift)
                    # Convertimos los días a una cadena de 7 caracteres
                    frequency = ''.join(['1' if day else '0' for day in shift['frequency']])
                    new_shift = ShiftCourses(
                        id_course=course.id,
                        start_time=shift['start_time'],
                        end_time=shift['end_time'],
                        frequency=frequency,
                        free_vacancies=course.vacancies
                    )
                    db.session.add(new_shift)

            # manejamos las imagenes
            images = request.files.getlist('images') # obtenemos las imagenes enviadas a agregar

            # configurción de directorio de imagenes de un servicio
            upload_folder = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service.id))
            os.makedirs(upload_folder, exist_ok=True)

            image_paths = []

            for image in images:
                if image.filename != '':
                    # Guardar el archivo con un nombre seguro
                    image_filename = secure_filename(image.filename)
                    image_path = os.path.join(upload_folder, f"image_{image_filename}")
                    image.save(image_path)

                    # Obtener la URL relativa para almacenar en la base de datos
                    image_url = f"/static/uploads/services/{service.id}/image_{image_filename}"
                    image_paths.append(image_url)

                    # Guardamos las imagenes en la base de datos
                    new_image = ImagesServices(id_service=service.id, url_image=image_url)
                    db.session.add(new_image)

            # Eliminamos las iamgenes que se quitaron
            images_to_remove = data["images_deleted"]
            print("===**==============**=====", images_to_remove)
            images_to_remove = list(images_to_remove.split(','))
            print("===**==============**=====", images_to_remove)
            for image_url in images_to_remove:
                image = ImagesServices.query.filter_by(url_image=image_url).first()

                # Eliminamos el archivo
                """
                image_path = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service.id), image_url.split('/')[-1])
                os.remove(image_path)   
                """
                if image:
                    db.session.delete(image) 
                    print("se debio haber eliminado")
                else:
                    print("no se elimino")

            #imagnees actuales
            current_images = ImagesServices.query.filter_by(id_service=service.id).all()
            l = []
            for image in current_images:
                if image.url_image not in images_to_remove:
                    l.append(image.url_image)   

            
            return jsonify({"success": True,
                            "message": "Curso actualizado exitosamente",
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
                                    "location": json.loads(course.ubicacion), #el front espera location en lugar de ubicación
                                    "min_age": course.min_age,
                                    "images": l
                                    }}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False,
                        "message": f"Error al actualizar curso: {str(e)}"}), 500


### turnos 

@cursos_bp.route('/company/courses/<int:id>/shifts', methods=['GET'])
def get_shifts(id):
    """
    Retorna todos los turnos de un curso
    """
    try:
        # Primero buscamos el curso
        course = Courses.query.get(id)
        if not course:
            return jsonify({"success": False, "message": "Curso no encontrado"}), 404

        # Buscamos los turnos del curso
        shifts = ShiftCourses.query.filter_by(id_course=id).all()
        
        # Preparamos los datos para la respuesta
        shifts_data = []
        for shift in shifts:
            # Convertimos los días a una lista de bools
            days = [bool(int(day)) for day in shift.frequency]
            print(days)
            shift_data = {
                "id": shift.id,
                "courseId": shift.id_course,
                "startTime": shift.start_time.strftime('%H:%M:%S'),
                "endTime": shift.end_time.strftime('%H:%M:%S'),
                "initialDays": days,
                "numReservations": course.vacancies - shift.free_vacancies,
                "freeVacancies": shift.free_vacancies,
            }
            shifts_data.append(shift_data)
        
        return jsonify({"success": True, "turnos": shifts_data}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"success": False, "message": f"Error al obtener turnos: {str(e)}"}), 500

        


