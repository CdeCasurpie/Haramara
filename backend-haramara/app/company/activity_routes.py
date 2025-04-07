from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, ImagesServices, ShiftActivities, Cupos, db
from app.auth.decorators import login_business_required
from datetime import datetime, timedelta
import json

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
            if field not in data or data[field] is "" or data[field] is None:
                return jsonify({
                    "success": False,
                    "message": f"El campo {field} es requerido"
                }), 400
        
        # Crear o obtener servicio asociado a la empresa
        service = Services(company_id=company_id)
        service.save()

        # location a string, pasar objeto a string con json.dumps
        print(data['location'])
        location = json.dumps(data['location'])
        print(location)

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
        activity.save()
            
        # Procesar imágenes si existen
        if 'images' in data and isinstance(data['images'], list):
            for image_data in data['images']:
                if isinstance(image_data, dict) and 'url' in image_data:
                    image = ImagesServices(
                        url_image=image_data['url'],
                        id_service=service.id
                    )
                    image.save()
        
        return jsonify({
            "success": True,
            "message": "Actividad creada exitosamente",
            "activity_id": activity.id
        }), 201
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error al crear la actividad: {str(e)}"
        }), 500


@activity_bp.route('/company/activities/<int:activity_id>', methods=['PUT'])
@login_business_required
def update_activity(activity_id):
    """
    Actualiza una actividad existente
    """
    company_id = get_jwt_identity()
    data = request.get_json()

    print(data)
    
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
        
        # Guardar los cambios en la actividad
        activity.save()
        
        # Actualizar imágenes si se proporcionan
        if 'images' in data and isinstance(data['images'], list):
            print(data['images'])
            # Obtener servicio asociado
            service_id = activity.id_service
            
            # Eliminar imágenes existentes si se proporciona una nueva lista completa
            ImagesServices.query.filter_by(id_service=service_id).delete()
            
            # Agregar nuevas imágenes
            for image_data in data['images']:
                if isinstance(image_data, dict) and 'url' in image_data:
                    image = ImagesServices(
                        url_image=image_data['url'],
                        id_service=service_id
                    )
                    image.save()
        
        return jsonify({
            "success": True,
            "message": "Actividad actualizada exitosamente",
            "activity_id": activity.id
        }), 200
        
    except Exception as e:
        # En caso de error, hacer rollback de la transacción
        db.session.rollback()
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
        
        # Opcional: Eliminar imágenes asociadas al servicio si ya no hay otras actividades
        remaining_activities = Activities.query.filter_by(id_service=service_id).count()
        if remaining_activities == 0:
            ImagesServices.query.filter_by(id_service=service_id).delete()
            
            # Opcional: Eliminar el servicio si ya no tiene otras actividades
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


