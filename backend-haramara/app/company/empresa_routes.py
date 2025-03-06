from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, Locations, ImagesServices, ShiftActivities, Cupos
from app.auth.decorators import login_business_required

empresa_bp = Blueprint('empresa_bp', __name__)

# EMPRESA =====================================================================

@empresa_bp.route('/company/<int:id>/details', methods=['GET'])
def get_company_details(id):
    """
    Retorna los detalles de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@empresa_bp.route('/company/<int:id>/items', methods=['GET'])
def get_company_items(id):
    """
    Retorna actividades, cursos, productos de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501