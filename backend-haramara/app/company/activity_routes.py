from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, ImagesServices, ShiftActivities, Cupos, db
from app.auth.decorators import login_business_required
from app.utils import save_base64_image
from datetime import datetime, timedelta, date
import json
import os
from werkzeug.utils import secure_filename

DAYS_MAP = {
    0: 'Mo',
    1: 'Tu',
    2: 'We',
    3: 'Th',
    4: 'Fr',
    5: 'Sa',
    6: 'Su'
}

activity_bp = Blueprint('activity_bp', __name__)

# ACTIVIDADES =================================================================

@activity_bp.route('/company/activities', methods=['GET'])
@login_business_required
def get_activities():
    """
    Obtiene todas las actividades de la empresa autenticada
    """
    company_id = get_jwt_identity()
    
    try:
        # Buscar los servicios de la empresa
        services = Services.query.filter_by(company_id=company_id).all()
        service_ids = [service.id for service in services]
        
        # Buscar las actividades asociadas a esos servicios
        activities = Activities.query.filter(Activities.id_service.in_(service_ids)).all()
        
        # Preparar los datos para la respuesta
        activities_data = []
        for activity in activities:
            # Obtener imágenes asociadas al servicio
            images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
            images_data = [{"id": img.id, "url": img.url_image} for img in images]
            
            # Preparar los datos básicos de la actividad
            activity_data = {
                "id": activity.id,
                "title": activity.titulo,
                "description": activity.description,
                "price_per_person": float(activity.price_per_person),
                "min_age": activity.min_age,
                "initial_vacancies": activity.initial_vacancies,
                "rating": 4.5,  # Valor de ejemplo (podría calcularse de reseñas)
                "characteristics": activity.features,  # Asumiendo que features almacena características
                "tags": activity.tags,
                "images": images_data,
                "location": json.loads(activity.ubicacion)
            }
            activities_data.append(activity_data)
        
        return jsonify({"success": True, "activities": activities_data}), 200
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error al obtener actividades: {str(e)}"}), 500


@activity_bp.route('/company/activities/<int:activity_id>', methods=['GET'])
@login_business_required
def get_activity(activity_id):
    """
    Obtiene los detalles completos de una actividad específica
    """
    company_id = get_jwt_identity()
    
    try:
        # Verificar que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == activity_id,
            Services.company_id == company_id
        ).first()
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        
        # Obtener las imágenes del servicio
        images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
        images_data = [{"id": img.id, "url": img.url_image} for img in images]
        
        # Preparar la respuesta detallada
        activity_data = {
            "id": activity.id,
            "title": activity.titulo,
            "description": activity.description,
            "price_per_person": float(activity.price_per_person),
            "min_age": activity.min_age,
            "initial_vacancies": activity.initial_vacancies,
            "characteristics": activity.features,
            "tags": activity.tags,
            "location": json.loads(activity.ubicacion),
            "images": images_data
        }
        
        return jsonify({
            "success": True,
            "activity": activity_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener los detalles de la actividad: {str(e)}"
        }), 500


@activity_bp.route('/company/activities/<int:activity_id>/shifts', methods=['GET'])
@login_business_required
def get_activity_shifts(activity_id):
    """
    Obtiene todos los turnos asociados a una actividad específica
    """
    company_id = get_jwt_identity()
    
    try:
        # Verificar que la actividad pertenezca a la empresa
        activity_exists = Activities.query.join(Services).filter(
            Activities.id == activity_id,
            Services.company_id == company_id
        ).first()
        
        if not activity_exists:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        # Obtener los turnos de la actividad
        shifts = ShiftActivities.query.filter_by(id_activity=activity_id).all()
        
        # Preparar datos de turnos
        shifts_data = []
        for shift in shifts:
            shift_data = {
                "id": shift.id,
                "day": shift.date,  # Mo, Tu, We, Th, Fr, Sa, Su
                "startTime": shift.start_time.strftime('%H:%M'),
                "endTime": shift.end_time.strftime('%H:%M'),
                "startDate": shift.start_date.strftime('%Y-%m-%d'),
                "endDate": shift.end_date.strftime('%Y-%m-%d'),
                "id_activity": activity_id,
                "availableSlots": activity_exists.initial_vacancies  # Valor inicial de cupos
            }
            shifts_data.append(shift_data)
        
        return jsonify({
            "success": True,
            "shifts": shifts_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener los turnos de la actividad: {str(e)}"
        }), 500


@activity_bp.route('/company/activities', methods=['POST'])
@login_business_required
def create_activity():
    """
    Crea una nueva actividad para la empresa
    """
    company_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Validar datos requeridos
        required_fields = ['title', 'description', 'price_per_person', 'min_age', 
                          'initial_vacancies', 'characteristics', 'tags', 'location']
        
        for field in required_fields:
            if field not in data or data[field] == "" or data[field] is None:
                return jsonify({
                    "success": False,
                    "message": f"El campo {field} es requerido"
                }), 400
        
        # Crear servicio asociado a la empresa
        with db.session.begin():
            service = Services(company_id=company_id)
            db.session.add(service)
            db.session.flush()

            # Configuración de directorio de imágenes de un servicio
            upload_folder = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service.id))
            os.makedirs(upload_folder, exist_ok=True)

            # location a string, pasar objeto a string con json.dumps
            location = json.dumps(data['location'])

            # Crear la actividad
            activity = Activities(
                id_service=service.id,
                titulo=data['title'],
                ubicacion=location,
                price_per_person=float(data['price_per_person']),
                description=data['description'],
                features=data.get('characteristics', {}),
                min_age=int(data['min_age']),
                initial_vacancies=int(data['initial_vacancies']),
                tags=data.get('tags', '')
            )
            db.session.add(activity)
            db.session.flush()
            
            image_paths = []
            
            # Procesar imágenes si existen
            if 'images' in data and isinstance(data['images'], list):
                for image_data in data['images']:
                    if isinstance(image_data, dict) and 'url' in image_data:
                        image_url = image_data['url']
                        
                        # Verificar si es una imagen en base64
                        if image_url.startswith('data:image'):
                            # Guardar la imagen base64 en el sistema de archivos
                            saved_url = save_base64_image(image_url, upload_folder)
                            if saved_url:
                                # Crear la entrada en la base de datos con la nueva URL
                                image = ImagesServices(
                                    url_image=saved_url,
                                    id_service=service.id
                                )
                                db.session.add(image)
                                image_paths.append(saved_url)
                        else:
                            # Es una URL normal, usarla directamente
                            image = ImagesServices(
                                url_image=image_url,
                                id_service=service.id
                            )
                            db.session.add(image)
                            image_paths.append(image_url)
            
            return jsonify({
                "success": True,
                "message": "Actividad creada exitosamente",
                "activity_id": activity.id,
                "images": image_paths
            }), 201
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
        print(f"Error al crear la actividad: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error al crear la actividad: {str(e)}"
        }), 500


@activity_bp.route('/company/activities/<int:activity_id>', methods=['PUT'])
@login_business_required
def update_activity(activity_id):
    """
    Actualiza una actividad existente y gestiona las imágenes:
    1. Mantiene solo las imágenes que vienen en el JSON
    2. Elimina todas las demás imágenes (físicamente y de la BD)
    3. Añade imágenes nuevas si hay en base64
    """
    company_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Verificar que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == activity_id,
            Services.company_id == company_id
        ).first()
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        # Actualizar campos de la actividad
        if 'title' in data:
            activity.titulo = data['title']
        if 'description' in data:
            activity.description = data['description']
        if 'price_per_person' in data:
            activity.price_per_person = float(data['price_per_person'])
        if 'min_age' in data:
            activity.min_age = int(data['min_age'])
        if 'initial_vacancies' in data:
            activity.initial_vacancies = int(data['initial_vacancies'])
        if 'characteristics' in data:
            activity.features = data['characteristics']
        if 'tags' in data:
            activity.tags = data['tags']
        
        # Actualizar la ubicación si se proporciona
        if 'location' in data and data['location']:
            activity.ubicacion = json.dumps(data['location'])
        
        # Obtener servicio asociado
        service_id = activity.id_service
        
        # Configuración de directorio de imágenes del servicio
        upload_folder = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service_id))
        os.makedirs(upload_folder, exist_ok=True)
        
        # PASO 1: Listar todas las imágenes actuales del servicio
        current_images = ImagesServices.query.filter_by(id_service=service_id).all()
        current_image_urls = {img.url_image: img for img in current_images}
        
        # Extraer las URLs de imágenes que vienen en el JSON
        incoming_image_urls = []
        if 'images' in data and isinstance(data['images'], list):
            for img in data['images']:
                if isinstance(img, dict) and 'url' in img:
                    # Solo considerar las URLs que no son base64
                    if not img['url'].startswith('data:image'):
                        incoming_image_urls.append(img['url'])
        
        # PASO 2: Identificar imágenes a eliminar (las que no están en el JSON)
        images_to_delete = []
        for url, img_obj in current_image_urls.items():
            if url not in incoming_image_urls:
                images_to_delete.append((url, img_obj))
        
        # PASO 3: Eliminar las imágenes identificadas
        for url, img_obj in images_to_delete:
            # Eliminar archivo físico si es una imagen local
            if not url.startswith(('http://', 'https://')):
                # Construir la ruta completa al archivo
                file_path = os.path.join(os.getcwd(), 'app', url.lstrip('/'))
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        print(f"Archivo eliminado: {file_path}")
                    except OSError as e:
                        print(f"Error al eliminar archivo de imagen: {str(e)}")
            
            # Eliminar de la base de datos
            db.session.delete(img_obj)
        
        # PASO 4: Procesar imágenes nuevas en base64
        if 'images' in data and isinstance(data['images'], list):
            for image_data in data['images']:
                if isinstance(image_data, dict) and 'url' in image_data:
                    image_url = image_data['url']
                    
                    # Verificar si es una imagen en base64
                    if image_url.startswith('data:image'):
                        # Guardar la imagen base64 en el sistema de archivos
                        saved_url = save_base64_image(image_url, upload_folder)
                        if saved_url:
                            # Crear la entrada en la base de datos con la nueva URL
                            new_image = ImagesServices(
                                url_image=saved_url,
                                id_service=service_id
                            )
                            db.session.add(new_image)
        
        # Guardar los cambios en la base de datos
        db.session.add(activity)
        db.session.commit()
        
        # Obtener todas las imágenes actuales después de los cambios
        updated_images = ImagesServices.query.filter_by(id_service=service_id).all()
        images_list = [{"id": img.id, "url": img.url_image} for img in updated_images]
        
        return jsonify({
            "success": True,
            "message": "Actividad actualizada exitosamente",
            "activity_id": activity.id,
            "images": images_list,
            "deleted_count": len(images_to_delete)
        }), 200
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
        print(f"Error al actualizar la actividad: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error al actualizar la actividad: {str(e)}"
        }), 500


@activity_bp.route('/company/activities/<int:activity_id>/shifts', methods=['POST'])
@login_business_required
def create_shifts(activity_id):
    """
    Crea nuevos turnos para una actividad.
    Los turnos existentes permanecen intactos, solo se añaden nuevos.
    """
    company_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Verificar que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == activity_id,
            Services.company_id == company_id
        ).first()
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        # Validar datos requeridos
        if 'shifts' not in data or not isinstance(data['shifts'], list):
            return jsonify({
                "success": False,
                "message": "Se requiere una lista de turnos en el campo 'shifts'"
            }), 400
        
        created_shifts = []
        
        # Procesar cada turno nuevo (sin ID)
        for shift_data in data['shifts']:
            # Verificar si el turno ya tiene ID (existente)
            if 'id' in shift_data and shift_data['id']:
                continue  # Ignorar turnos existentes
            
            # Validar datos requeridos para cada turno
            required_shift_fields = ['day', 'startTime', 'endTime', 'startDate', 'endDate']
            missing_fields = [field for field in required_shift_fields if field not in shift_data]
            
            if missing_fields:
                return jsonify({
                    "success": False,
                    "message": f"Campos requeridos faltantes en un turno: {', '.join(missing_fields)}"
                }), 400
            
            # Crear nuevo turno
            try:
                shift = ShiftActivities(
                    id_activity=activity_id,
                    start_time=datetime.strptime(shift_data['startTime'], '%H:%M').time(),
                    end_time=datetime.strptime(shift_data['endTime'], '%H:%M').time(),
                    date=shift_data['day'],  # Asumiendo que day es un valor válido (Mo, Tu, etc.)
                    start_date=datetime.strptime(shift_data['startDate'], '%Y-%m-%d').date(),
                    end_date=datetime.strptime(shift_data['endDate'], '%Y-%m-%d').date()
                )
                shift.save()
                created_shifts.append(shift)
                
                # No generamos cupos automáticamente aquí
                # La lógica de cupos será manejada por separado
                
            except ValueError as ve:
                return jsonify({
                    "success": False,
                    "message": f"Error en el formato de datos: {str(ve)}"
                }), 400
        
        return jsonify({
            "success": True,
            "message": f"Se crearon {len(created_shifts)} nuevos turnos exitosamente",
            "shifts_created": len(created_shifts)
        }), 201
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error al crear turnos: {str(e)}"
        }), 500


@activity_bp.route('/company/activities/<int:activity_id>', methods=['DELETE'])
@login_business_required
def delete_activity(activity_id):
    """
    Elimina una actividad y sus recursos asociados
    """
    company_id = get_jwt_identity()
    
    try:
        # Verificar que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == activity_id,
            Services.company_id == company_id
        ).first()
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        # Obtener el servicio asociado
        service_id = activity.id_service
        
        # Eliminar turnos y cupos asociados
        shifts = ShiftActivities.query.filter_by(id_activity=activity_id).all()
        for shift in shifts:
            # Eliminar cupos del turno
            Cupos.query.filter_by(id_ShiftActivity=shift.id).delete()
            # Eliminar el turno
            shift.delete()
        
        # Eliminar la actividad
        activity.delete()
        
        # Obtener imágenes asociadas al servicio
        images = ImagesServices.query.filter_by(id_service=service_id).all()
        
        # Verificar si quedan otras actividades asociadas al servicio
        remaining_activities = Activities.query.filter_by(id_service=service_id).count()
        
        # Si no hay más actividades, eliminar las imágenes y el servicio
        if remaining_activities == 0:
            # Eliminar archivos físicos de imágenes
            for image in images:
                # Solo eliminar archivos locales (no URLs externas)
                if not image.url_image.startswith(('http://', 'https://')):
                    file_path = os.path.join(os.getcwd(), 'app', image.url_image.lstrip('/'))
                    if os.path.exists(file_path):
                        try:
                            os.remove(file_path)
                        except OSError as e:
                            print(f"Error al eliminar archivo de imagen: {str(e)}")
            
            # Eliminar registros de imágenes de la base de datos
            ImagesServices.query.filter_by(id_service=service_id).delete()
            
            # Eliminar el directorio de imágenes del servicio si está vacío
            upload_dir = os.path.join(os.getcwd(), 'app', 'static', 'uploads', 'services', str(service_id))
            if os.path.exists(upload_dir):
                try:
                    # Intentar eliminar el directorio (solo funcionará si está vacío)
                    os.rmdir(upload_dir)
                except OSError as e:
                    print(f"No se pudo eliminar el directorio de imágenes: {str(e)}")
            
            # Eliminar el servicio
            service = Services.query.get(service_id)
            if service:
                service.delete()
        
        return jsonify({
            "success": True,
            "message": "Actividad eliminada exitosamente"
        }), 200
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error al eliminar la actividad: {str(e)}"
        }), 500


# Rutas para el cliente
@activity_bp.route('/activities', methods=['GET'])
def get_all_activities():
    """
    Obtiene todas las actividades disponibles para los clientes con paginación.
    Query parameters:
        - page: número de página (por defecto 1)
        - page_size: tamaño de página (por defecto 10)
    """
    try:
        # Obtener parámetros de paginación
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('page_size', default=10, type=int)
        
        if page < 1 or page_size < 1:
            return jsonify({"success": False, "message": "Parámetros de paginación inválidos"}), 400

        # Calcular el desplazamiento
        offset = (page - 1) * page_size

        # Obtener actividades con límite y desplazamiento
        activities = Activities.query.offset(offset).limit(page_size).all()
        
        # Obtener el total de actividades para saber cuántas páginas hay
        total_activities = Activities.query.count()

        # Preparar los datos para la respuesta
        activities_data = []
        for activity in activities:
            # Obtener imágenes asociadas al servicio
            images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
            images_data = [{"id": img.id, "url": img.url_image} for img in images]
            
            # Preparar los datos básicos de la actividad
            activity_data = {
                "id": activity.id,
                "title": activity.titulo,
                "price_per_person": float(activity.price_per_person),
                "rating": 4.5,  # Valor de ejemplo (podría calcularse de reseñas)
                "num_reservations": 10,  # Valor de ejemplo (podría calcularse de reservas)
                "images": images_data,
                "location": json.loads(activity.ubicacion),
                "tags": activity.tags,
                "min_age": activity.min_age,
            }
            activities_data.append(activity_data)
        
        return jsonify({
            "success": True,
            "activities": activities_data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_items": total_activities,
                "total_pages": (total_activities + page_size - 1) // page_size  # redondeo hacia arriba
            }
        }), 200
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error al obtener actividades: {str(e)}"}), 500
    

@activity_bp.route('/activities/<int:activity_id>', methods=['GET'])
def get_activity_details(activity_id):
    """
    Obtiene los detalles completos de una actividad específica para el cliente
    """
    try:
        # Obtener la actividad por ID
        activity = Activities.query.get(activity_id)
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada"
            }), 404
        
        # Obtener imágenes asociadas al servicio
        images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
        images_data = [{"id": img.id, "url": img.url_image} for img in images]

        # Preparar la respuesta detallada
        activity_data = {
            "id": activity.id,
            "title": activity.titulo,
            "description": activity.description,
            "price_per_person": float(activity.price_per_person),
            "min_age": activity.min_age,
            "initial_vacancies": activity.initial_vacancies,
            "characteristics": activity.features,
            "tags": activity.tags,
            "location": json.loads(activity.ubicacion),
            "images": images_data,
            "rating": 4.5,  # Valor de ejemplo (podría calcularse de reseñas)
        }
        
        return jsonify({
            "success": True,
            "activity": activity_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener los detalles de la actividad: {str(e)}"
        }), 500


@activity_bp.route('/activities/<int:activity_id>/shifts', methods=['GET'])
def get_activity_shifts_for_year(activity_id):
    """
    Obtiene todos los turnos disponibles para una actividad específica en el año dado (o el año actual por defecto)
    """
    try:
        # Obtener la actividad
        activity = Activities.query.get(activity_id)
        if not activity:
            return jsonify({"success": False, "message": "Actividad no encontrada"}), 404
        
        # Obtener parámetros para el año
        year = request.args.get('year', default=date.today().year, type=int)

        # Fecha inicial y final del año
        start_of_year = date(year, 1, 1)
        end_of_year = date(year, 12, 31)

        # Diccionario para agrupar fechas con turnos
        dict_fechas_turnos = {}

        current_date = start_of_year

        while current_date <= end_of_year:
            dia_semana = DAYS_MAP[current_date.weekday()]

            # Buscar turnos activos para ese día
            shifts = ShiftActivities.query.filter(
                ShiftActivities.id_activity == activity_id,
                ShiftActivities.start_date <= current_date,
                ShiftActivities.end_date >= current_date,
                ShiftActivities.date == dia_semana
            ).all()

            for shift in shifts:
                # Ver si hay un cupo materializado para esa fecha
                cupo = Cupos.query.filter_by(id_ShiftActivity=shift.id, fecha=current_date).first()

                # Preparar la información del turno
                shift_info = {
                    "id": str(shift.id),
                    "startTime": shift.start_time.strftime("%H:%M"),
                    "endTime": shift.end_time.strftime("%H:%M"),
                    "freeVacancies": cupo.free_vacancies if cupo else activity.initial_vacancies,
                }

                # Si ya existe la fecha en el diccionario, agregamos el turno a la lista
                if current_date.isoformat() in dict_fechas_turnos:
                    dict_fechas_turnos[current_date.isoformat()].append(shift_info)
                else:
                    dict_fechas_turnos[current_date.isoformat()] = [shift_info]
            # Pasar al día siguiente
            current_date += timedelta(days=1)

        # Lista para ver los dias ocupados
        occupied_days = []

        for fecha, turnos in dict_fechas_turnos.items():
            if all(turno["freeVacancies"] == 0 for turno in turnos):
                occupied_days.append(fecha)     
        

        return jsonify({"success": True, "shifts": dict_fechas_turnos, "occupied_days": occupied_days}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Error al obtener turnos: {str(e)}"}), 500
