from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Activities, Services, Locations, ImagesServices, ShiftActivities, Cupos
from app.auth.decorators import login_business_required

productos_bp = Blueprint('productos_bp', __name__)

# PRODUCTOS ===================================================================

@productos_bp.route('/company/products', methods=['GET'])
def get_products():
    """
    Retorna todos los productos de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@productos_bp.route('/company/products/<int:id>', methods=['GET'])
def get_product(id):
    """
    Retorna un producto de la empresa y todos sus detalles
    """
    return jsonify({'message': 'not implemented yet'}), 501

@productos_bp.route('/company/products', methods=['POST'])
def create_product():
    """
    Crea un producto
    """
    return jsonify({'message': 'not implemented yet'}), 501

@productos_bp.route('/company/products/<int:id>', methods=['PUT'])
def update_product(id):
    """
    Actualiza un producto
    """
    return jsonify({'message': 'not implemented yet'}), 501