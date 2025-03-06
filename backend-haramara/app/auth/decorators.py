from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

def login_required(fn):
    """
    Decorador que verifica si el usuario está autenticado (puede ser cliente o empresa)
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": "Autenticación requerida"}), 401
    return wrapper

def login_client_required(fn):
    """
    Decorador que verifica si el usuario autenticado es un cliente (tipo user)
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('type') != 'user':
                return jsonify({"success": False, "message": "Acceso solo para clientes"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": "Autenticación requerida"}), 401
    return wrapper

def login_business_required(fn):
    """
    Decorador que verifica si el usuario autenticado es una empresa (tipo company)
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('type') != 'company':
                return jsonify({"success": False, "message": "Acceso solo para empresas"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": "Autenticación requerida"}), 401
    return wrapper