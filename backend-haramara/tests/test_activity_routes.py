import pytest
from app import create_app
from app.models import Users, Companies, TemporalCompanies, TemporalLocations, db
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app = create_app('testing')  # Asegúrate de tener un entorno de prueba configurado
    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Crea las tablas en la base de datos de prueba
        yield client

def test_register_company(client):
    response = client.post('/auth/register/company/temporal', json={
        'name': 'Test Company',
        'email': 'testcompany@example.com',
        'password': 'password123',
        'name_representative': 'John',
        'last_name_representative': 'Doe',
        'is_safe': True,
        'has_languages': False,
        'address': '123 Test St',
        'country': 'Testland',
        'comunity': 'Test Community',
        'province': 'Test Province',
        'postal_code': '12345'
    })
    assert response.status_code == 201
    assert response.json['success'] is True

def test_accept_all_companies(client):
    # Primero, registramos una empresa temporal
    client.post('/auth/register/company/temporal', json={
        'name': 'Test Company',
        'email': 'testcompany@example.com',
        'password': 'password123',
        'name_representative': 'John',
        'last_name_representative': 'Doe',
        'is_safe': True,
        'has_languages': False,
        'address': '123 Test St',
        'country': 'Testland',
        'comunity': 'Test Community',
        'province': 'Test Province',
        'postal_code': '12345'
    })

    # Aceptamos todas las empresas temporales
    response = client.post('/auth/accept-all-companies', json={'password': '73114941'})
    assert response.status_code == 200
    assert response.json['success'] is True

def test_login_company(client):
    # Registramos y aceptamos la empresa
    client.post('/auth/register/company/temporal', json={
        'name': 'Test Company',
        'email': 'testcompany@example.com',
        'password': 'password123',
        'name_representative': 'John',
        'last_name_representative': 'Doe',
        'is_safe': True,
        'has_languages': False,
        'address': '123 Test St',
        'country': 'Testland',
        'comunity': 'Test Community',
        'province': 'Test Province',
        'postal_code': '12345'
    })
    client.post('/auth/accept-all-companies', json={'password': '73114941'})

    # Iniciar sesión como empresa
    response = client.post('/auth/login', json={
        'email': 'testcompany@example.com',
        'password': 'password123',
        'type': 'company'
    })
    assert response.status_code == 200
    assert response.json['success'] is True
    token = response.json['token']

    return token  # Retorna el token para usar en las siguientes pruebas

def test_create_activity(client):
    token = test_login_company(client)  # Inicia sesión y obtiene el token

    # Crear una actividad
    response = client.post('/company/activities', json={
        'titulo': 'Test Activity',
        'description': 'This is a test activity.',
        'price_per_person': 50.0,
        'min_age': 18,
        'initial_vacancies': 10,
        'features': {'duration': '2 hours'},
        'tags': 'test,activity',
        'location': {
            'address': '123 Test St',
            'country': 'Testland',
            'comunity': 'Test Community',
            'province': 'Test Province',
            'postal_code': '12345'
        },
        'shifts': [{
            'start_time': '09:00',
            'end_time': '11:00',
            'day': 'Mo',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31'
        }]
    }, headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 201
    assert response.json['success'] is True
    assert response.json['message'] == 'Actividad creada exitosamente' 