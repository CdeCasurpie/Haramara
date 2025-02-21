# app/auth/routes.py
from app.auth import auth_bp
from app.auth.utils import *
from flask import jsonify, request
from flask_jwt_extended import set_access_cookies, jwt_required, get_jwt_identity, get_jwt

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

    if data['type'] not in ['user', 'company']:
        return jsonify({'success': False, 'message': 'invalid type'}), 400
    
    entity = search_user(data['email']) if data['type'] == 'user' else search_company(data['email'])

    if not entity or entity.id == None:
        return jsonify({'success': False, 'message': 'user or company not found'}), 404
    
    if not entity.check_password(data['password']):
        return jsonify({'success': False, 'message': 'incorrect password'}), 401

    # generate token
    token = generate_token(entity.id, data['type'])

    # returns token and user data
    response = jsonify({
        'success': True,
        'user': {
            'id': entity.id,
            'email': entity.email,
            'type': data['type']
        }
    })

    set_access_cookies(response, token, max_age=timedelta(days=1))
    #response.headers["Access-Control-Allow-Credentials"] = "true"  

    return response, 200


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
    data, missing = get_post_data(request, ['username', 'email', 'password'])

    if not data:
        return jsonify({'success': False, 'message': 'missing fields', 'missing': missing}), 400
    
    if not is_valid_email(data['email']): 
        return jsonify({'success': False, 'message': 'invalid email'}), 400
    
    existing_user = search_user(data['email'])

    if existing_user:
        return jsonify({'success': False, 'message': 'user already exists'}), 409
    
    #creamos nuevo usuario
    new_user = Users(username=data['username'], email=data['email'], password=data['password'])

    try:
        new_user.save()

        return jsonify({'success': True, 'message': 'user created successfully', 'data': {
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email
        }}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'error creating user: ' + str(e)}), 500


@auth_bp.route('/auth/register/company/temporal', methods=['POST'])
def register_company():
    """
    Registra una empresa temporal y su ubicacion temporal
    """
    data, missing = get_post_data(request, ['name', 'email', 'password', 'name_representative', 'last_name_representative', "is_safe", "has_languages",  'address', 'country', 'comunity', 'province', 'postal_code'])

    if not data:
        return jsonify({'success': False, 'message': 'missing fields', 'missing': missing}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({'success': False, 'message': 'invalid email'}), 400
    
    with db.session.begin():
        existing_company = search_company(data['email'])

        if existing_company:
            return jsonify({'success': False, 'message': 'company already exists'}), 409
        
        #verificamos unicidad de nombre de empresa
        if Companies.query.filter_by(name=data['name']).first():
            return jsonify({'success': False, 'message': 'company name already exists'}), 409

        #creamos nueva ubicacion
        new_location = TemporalLocations(address=data['address'], country=data['country'], comunity=data['comunity'], province=data['province'], postal_code=data['postal_code'])
        
        #verificamos si la ubicacion ya existe
        if search_location(new_location):
            return jsonify({'success': False, 'message': 'location already exists'}), 409
        
        # Creamos una compañía dentro de una sesión
        try:
            db.session.add(new_location) 
            db.session.flush() 

            new_company = TemporalCompanies(
                name=data['name'], 
                email=data['email'], 
                password=data['password'], 
                name_representative=data['name_representative'], 
                last_name_representative=data['last_name_representative'], 
                is_safe=data['is_safe'], 
                has_languages=data['has_languages'], 
                id_location=new_location.id
            )
            db.session.add(new_company)
            db.session.flush()

            return jsonify({'success': True, 'message': 'temporal company created successfully', 'data': {
                'id': new_company.id,
                'name': new_company.name,
                'email': new_company.email
            }}), 201

        except Exception as e:
            db.session.rollback()  # Revierte cambios en caso de error
            return jsonify({'success': False, 'message': 'error creating temporal company: ' + str(e)}), 500


@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Obtiene la información del usuario autenticado
    """
    id = get_jwt_identity()
    claims = get_jwt()
    user_type = claims['type']

    if user_type == 'user':
        user = Users.query.get(id)
        return jsonify({'id': id, 'username': user.username, 'email': user.email, 'url_image':user.url_image, 'type': claims['type']}), 200
    else:
        company = Companies.query.get(id)
        return jsonify({'id': id, 'name': company.name, 'email': company.email, 'url_image':company.url_image, 'type': claims['type']}), 200


"""
Ruta para confirmar el registro de una empresa

@app.route('/auth/register/company/<int:company_id>/location/<int:location_id>', methods=['POST'])
def confirm_register_company():
"""