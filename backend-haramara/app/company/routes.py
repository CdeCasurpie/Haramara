# app/company/routes.py
from app.company import company_bp
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from app.models import db, Activities, ShiftActivities, Cupos, ImagesServices, Services, Locations, Courses
from app.auth.decorators import login_business_required

@company_bp.route('/company')
def get_company():
    return 'Company! Hello from company_bp'


@company_bp.route('/company/dashboard', methods=['GET'])
def get_dashboard():
    """
    Retorna información de la empresa logeada (act, cursos, estadisticas, etc)
    """
    return jsonify({'message': 'not implemented yet'}), 501



# OFERTAS =====================================================================

# TO DO: Determinar rutas para las ofertas