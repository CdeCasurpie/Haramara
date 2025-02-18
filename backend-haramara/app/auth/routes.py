# app/auth/routes.py
from app.auth import auth_bp
from flask import jsonify

@auth_bp.route('/auth')
def auth():
    return 'Auth! Hello from auth_bp'

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """
    Logea un usuario
    """
    return jsonify({'message': 'not implemented yet'}), 501

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """
    Deslogea un usuario
    """
    return jsonify({'message': 'not implemented yet'}), 501

@auth_bp.route('/auth/register/user', methods=['POST'])
def register_user():
    """
    Registra un usuario
    """
    return jsonify({'message': 'not implemented yet'}), 501

@auth_bp.route('/auth/register/company', methods=['POST'])
def register_company():
    """
    Registra una empresa
    """
    return jsonify({'message': 'not implemented yet'}), 501