from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, Locations, ImagesServices, ShiftActivities, Cupos, db
from app.auth.decorators import login_business_required
from datetime import datetime, timedelta

activity_bp = Blueprint('activity_bp', __name__)


# ACTIVIDADES =================================================================

@activity_bp.route('/company/activities', methods=['GET'])
@login_business_required
def get_activities():
    """
    Retorna todas las actividades de la empresa
    """
    company_id = get_jwt_identity()
    
    try:
        # Primero buscamos los servicios de la empresa
        services = Services.query.filter_by(company_id=company_id).all()
        service_ids = [service.id for service in services]
        
        # Luego buscamos las actividades asociadas a esos servicios
        activities = Activities.query.filter(Activities.id_service.in_(service_ids)).all()
        
        # Preparamos los datos para la respuesta
        activities_data = []
        for activity in activities:
            # Obtenemos imágenes asociadas al servicio
            images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
            images_data = [{"id": img.id, "url": img.url_image} for img in images]
            
            # Preparamos los datos de la actividad
            activity_data = {
                "id": activity.id,
                "titulo": activity.titulo,
                "description": activity.description,
                "price_per_person": activity.price_per_person,
                "min_age": activity.min_age,
                "initial_vacancies": activity.initial_vacancies,
                "features": activity.features,
                "tags": activity.tags,
                "images": images_data
            }
            activities_data.append(activity_data)
        
        return jsonify({"success": True, "activities": activities_data}), 200
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error al obtener actividades: {str(e)}"}), 500


@activity_bp.route('/company/activities/<int:id>', methods=['GET'])
@login_business_required
def get_activity(id):
    """
    Retorna una actividad de la empresa y todos sus detalles
    """
    company_id = get_jwt_identity()
    
    try:
        # Primero verificamos que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == id,
            Services.company_id == company_id
        ).first()
        
        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404
        
        # Obtenemos la ubicación de la actividad
        location = Locations.query.get(activity.id_ubicacion)
        
        # Obtenemos las imágenes del servicio
        images = ImagesServices.query.filter_by(id_service=activity.id_service).all()
        images_data = [{"id": img.id, "url": img.url_image} for img in images]
        
        # Obtenemos los horarios de la actividad
        shifts = ShiftActivities.query.filter_by(id_activity=activity.id).all()
        shifts_data = [{
            "id": shift.id,
            "start_time": shift.start_time.strftime('%H:%M'),
            "end_time": shift.end_time.strftime('%H:%M'),
            "day": shift.date,
            "start_date": shift.start_date.strftime('%Y-%m-%d'),
            "end_date": shift.end_date.strftime('%Y-%m-%d')
        } for shift in shifts]
        
        # Obtenemos los cupos disponibles
        cupos = Cupos.query.join(ShiftActivities).filter(
            ShiftActivities.id_activity == activity.id
        ).all()
        cupos_data = [{
            "id": cupo.id,
            "fecha": cupo.fecha.strftime('%Y-%m-%d'),
            "free_vacancies": cupo.free_vacancies,
            "id_shift": cupo.id_ShiftActivity
        } for cupo in cupos]
        
        # Preparamos la respuesta completa
        activity_data = {
            "id": activity.id,
            "titulo": activity.titulo,
            "description": activity.description,
            "price_per_person": activity.price_per_person,
            "min_age": activity.min_age,
            "initial_vacancies": activity.initial_vacancies,
            "features": activity.features,
            "tags": activity.tags,
            "location": {
                "id": location.id,
                "address": location.address,
                "country": location.country,
                "comunity": location.comunity,
                "province": location.province,
                "postal_code": location.postal_code
            },
            "images": images_data,
            "shifts": shifts_data,
            "cupos": cupos_data
        }
        
        return jsonify({
            "success": True,
            "activity": activity_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener la actividad: {str(e)}"
        }), 500

@activity_bp.route('/company/activities', methods=['POST'])
@login_business_required
def create_activity():
    """
    Crea una actividad para la empresa
    """
    company_id = get_jwt_identity()
    data = request.get_json()

    try:
        # Validar datos requeridos
        required_fields = ['titulo', 'description', 'price_per_person', 'min_age', 
                         'initial_vacancies', 'features', 'tags', 'location', 'shifts']
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"El campo {field} es requerido"
                }), 400

        # Crear ubicación
        location = Locations(
            address=data['location']['address'],
            country=data['location']['country'],
            comunity=data['location']['comunity'],
            province=data['location']['province'],
            postal_code=data['location']['postal_code']
        )
        location.save()

        # Crear o obtener servicio asociado a la empresa
        service = Services(company_id=company_id)
        service.save()

        # Crear actividad
        activity = Activities(
            id_service=service.id,
            titulo=data['titulo'],
            id_ubicacion=location.id,
            price_per_person=float(data['price_per_person']),
            description=data['description'],
            features=data['features'],
            min_age=int(data['min_age']),
            initial_vacancies=int(data['initial_vacancies']),
            tags=data['tags']
        )
        activity.save()

        # Procesar imágenes si existen
        if 'images' in data:
            for image_url in data['images']:
                image = ImagesServices(
                    url_image=image_url,
                    id_service=service.id
                )
                image.save()

        # Crear horarios y cupos
        for shift_data in data['shifts']:
            shift = ShiftActivities(
                id_activity=activity.id,
                start_time=datetime.strptime(shift_data['start_time'], '%H:%M').time(),
                end_time=datetime.strptime(shift_data['end_time'], '%H:%M').time(),
                date=shift_data['day'],
                start_date=datetime.strptime(shift_data['start_date'], '%Y-%m-%d').date(),
                end_date=datetime.strptime(shift_data['end_date'], '%Y-%m-%d').date()
            )
            shift.save()

            # Crear cupos para cada día entre start_date y end_date
            current_date = shift.start_date
            while current_date <= shift.end_date:
                # Verificar si el día de la semana coincide con el turno
                if current_date.strftime('%a')[:2] == shift.date:
                    cupo = Cupos(
                        id_ShiftActivity=shift.id,
                        fecha=current_date,
                        free_vacancies=activity.initial_vacancies
                    )
                    cupo.save()
                current_date += timedelta(days=1)

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

@activity_bp.route('/company/activities/<int:id>', methods=['PUT'])
@login_business_required
def update_activity(id):
    """
    Acualiza una actividad de la empresa
    """
    company_id = get_jwt_identity()
    data = request.get_json()

    try:
        # Verificar que la actividad pertenezca a la empresa
        activity = Activities.query.join(Services).filter(
            Activities.id == id,
            Services.company_id == company_id
        ).first()

        if not activity:
            return jsonify({
                "success": False,
                "message": "Actividad no encontrada o no pertenece a esta empresa"
            }), 404

        # Actualizar los campos de la actividad
        if 'titulo' in data:
            activity.titulo = data['titulo']
        if 'description' in data:
            activity.description = data['description']
        if 'price_per_person' in data:
            activity.price_per_person = float(data['price_per_person'])
        if 'min_age' in data:
            activity.min_age = int(data['min_age'])
        if 'initial_vacancies' in data:
            activity.initial_vacancies = int(data['initial_vacancies'])
        if 'features' in data:
            activity.features = data['features']
        if 'tags' in data:
            activity.tags = data['tags']
        
        # Guardar los cambios en la actividad
        activity.save()

        # Actualizar la ubicación si se proporciona
        if 'location' in data:
            location = Locations.query.get(activity.id_ubicacion)
            if location:
                location.address = data['location'].get('address', location.address)
                location.country = data['location'].get('country', location.country)
                location.comunity = data['location'].get('comunity', location.comunity)
                location.province = data['location'].get('province', location.province)
                location.postal_code = data['location'].get('postal_code', location.postal_code)
                location.save()

        # Actualizar imágenes si se proporciona
        if 'images' in data:
            # Eliminar imágenes existentes
            ImagesServices.query.filter_by(id_service=activity.id_service).delete()
            for image_url in data['images']:
                image = ImagesServices(
                    url_image=image_url,
                    id_service=activity.id_service
                )
                image.save()

        return jsonify({
            "success": True,
            "message": "Actividad actualizada exitosamente",
            "activity_id": activity.id
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al actualizar la actividad: {str(e)}"
        }), 500
