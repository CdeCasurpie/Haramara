# app/auth/routes.py
from app.auth import auth_bp
from app.auth.utils import *
from flask import jsonify, request

@auth_bp.route('/auth')
def auth():
    return 'Auth! Hello from auth_bp'

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """
    Logea un usuario, en modo cliente o empresa
    """

    # obtain data

    data, missing = get_post_data(request, ['email', 'password', 'type'])

    if not data:
        return jsonify({'success': False, 'message': 'missing fields', 'missing': missing}), 400

    if not is_valid_email(data['email']):
        return jsonify({'success': False, 'message': 'invalid email'}), 400


    user = search_user(data['email'], data['password']) if data['type'] == 'user' else search_company(data['email'], data['password'])

    if not user or user.id == None:
        return jsonify({'success': False, 'message': 'user not found'}), 404
    
    token = generate_token(user.id, data['type'])

    # returns token and user data
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'type': data['type']
        }
    }), 200


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