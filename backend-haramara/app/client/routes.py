# app/client/routes.py
from app.client import client_bp
from flask import jsonify

@client_bp.route('/client')
def client():
    return 'Client! Hello from client_bp'

@client_bp.route('/client/home')
def home():
    """
    Retorna 3 actividades y 3 productos que se mostrarán en la página principal
    """
    return jsonify({'message': 'not implemented yet'}), 501


# ACTIVIDADES ==========================================================================================================

@client_bp.route('/client/activities', methods=['GET'])
def activities():
    """
    Filtra las actividades por ubicación, categoría y precio
    """
    return jsonify({'message': 'not implemented yet'}), 501



@client_bp.route('/client/activities/<int:id>/detail', methods=['GET'])
def activity_detail(id):
    """
    Retorna el detalle de una actividad y sus turnos
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/activities/<int:id>/turns', methods=['GET'])
def activity_turns(id):
    """
    Retorna todos los turnos disponibles en una fecha específica para una actividad
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/activities/<int:id>/reserve', methods=['POST'])
def reserve_activity(id):
    """
    Prereserva un turno, realiza el pago y confirma la reserva.

    Recibe: 
    - Datos para realizar el pago encrptados
    - Id del turno
    - Id del usuario
    - Cantidad de personas
    """
    return jsonify({'message': 'not implemented yet'}), 501



# CURSOS ===============================================================================================================
@client_bp.route('/client/courses', methods=['GET'])
def courses():
    """
    Filtra los cursos por ubicación, categoría y otros filtros
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/courses/<int:id>/detail', methods=['GET'])
def course_detail(id):
    """
    Retorna el detalle de un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/courses/<int:id>/reserve', methods=['POST'])
def reserve_course(id):
    """
    Prereserva un curso, realiza el pago y confirma la reserva.

    Recibe: 
    - Datos para realizar el pago encrptados
    - Id del curso
    - Id del usuario
    - Cantidad de personas
    """
    return jsonify({'message': 'not implemented yet'}), 501


# PRODUCTOS ============================================================================================================
@client_bp.route('/client/products', methods=['GET'])
def products():
    """
    Filtra los productos por ubicación, categoría y otros filtros
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/products/<int:id>/detail', methods=['GET'])
def product_detail(id):
    """
    Retorna el detalle de un producto
    """
    return jsonify({'message': 'not implemented yet'}), 501

    
@client_bp.route('/client/products/shopping_cart_suggestions', methods=['GET'])
def shopping_cart():
    """
    Devuelve un listado de productos sugeridos para agregar al carrito
    """
    return jsonify({'message': 'not implemented yet'}), 501


@client_bp.route('/client/products/buy', methods=['POST'])
def buy_products():
    """
    Realiza la compra de productos y envía la orden a las empresas correspondientes.

    Recibe:
    - datos de pago
    - lista de productos a comprar (ids, cantidades, id de la empresa, etc)
    - id del usuario
    - datos extras del envio
    """
    return jsonify({'message': 'not implemented yet'}), 501