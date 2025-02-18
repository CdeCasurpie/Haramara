# app/company/routes.py
from app.company import company_bp
from flask import jsonify

@company_bp.route('/company')
def get_company():
    return 'Company! Hello from company_bp'


@company_bp.route('/company/dashboard', methods=['GET'])
def get_dashboard():
    """
    Retorna información de la empresa logeada (act, cursos, estadisticas, etc)
    """
    return jsonify({'message': 'not implemented yet'}), 501



# ACTIVIDADES =================================================================

@company_bp.route('/company/activities', methods=['GET'])
def get_activities():
    """
    Retorna todas las actividades de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/activities/<int:id>', methods=['GET'])
def get_activity(id):
    """
    Retorna una actividad de la empresa y todos sus detalles
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/activities', methods=['POST'])
def create_activity():
    """
    Crea una actividad
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/activities/<int:id>', methods=['PUT'])
def update_activity(id):
    """
    Actualiza una actividad
    """
    return jsonify({'message': 'not implemented yet'}), 501

# CURSOS ======================================================================

@company_bp.route('/company/courses', methods=['GET'])
def get_courses():
    """
    Retorna todos los cursos de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/courses/<int:id>', methods=['GET'])
def get_course(id):
    """
    Retorna un curso de la empresa y todos sus detalles
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/courses', methods=['POST'])
def create_course():
    """
    Crea un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/courses/<int:id>', methods=['PUT'])
def update_course(id):
    """
    Actualiza un curso
    """
    return jsonify({'message': 'not implemented yet'}), 501

# PRODUCTOS ===================================================================

@company_bp.route('/company/products', methods=['GET'])
def get_products():
    """
    Retorna todos los productos de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/products/<int:id>', methods=['GET'])
def get_product(id):
    """
    Retorna un producto de la empresa y todos sus detalles
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/products', methods=['POST'])
def create_product():
    """
    Crea un producto
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/products/<int:id>', methods=['PUT'])
def update_product(id):
    """
    Actualiza un producto
    """
    return jsonify({'message': 'not implemented yet'}), 501


# EMPRESA =====================================================================

@company_bp.route('/company/<int:id>/details', methods=['GET'])
def get_company_details(id):
    """
    Retorna los detalles de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501

@company_bp.route('/company/<int:id>/items', methods=['GET'])
def get_company_items(id):
    """
    Retorna actividades, cursos, productos de la empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501


# OFERTAS =====================================================================

# TO DO: Determinar rutas para las ofertas