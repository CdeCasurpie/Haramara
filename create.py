import os

def create_flask_project(project_name):
    # Crear estructura de carpetas
    os.makedirs(f"{project_name}/app/templates")
    os.makedirs(f"{project_name}/app/static")
    os.makedirs(f"{project_name}/app/models")

    # Crear archivo __init__.py
    with open(f"{project_name}/app/__init__.py", "w") as f:
        f.write(
            """from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar la base de datos
    db.init_app(app)

    # Crear tablas en la base de datos (solo en desarrollo)
    with app.app_context():
        db.create_all()

    # Registrar blueprints o rutas
    from app.routes import main_routes
    app.register_blueprint(main_routes)

    return app
"""
        )

    # Crear archivo config.py
    with open(f"{project_name}/config.py", "w") as f:
        f.write(
            """import os

class Config:
    # Usar SQLite como base de datos local
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
"""
        )

    # Crear archivo routes.py
    with open(f"{project_name}/app/routes.py", "w") as f:
        f.write(
            """from flask import Blueprint
from app.models import User, db

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def index():
    # Ejemplo: Crear un nuevo usuario
    new_user = User(username='john_doe', email='john@example.com')
    db.session.add(new_user)
    db.session.commit()
    return 'Usuario creado correctamente!'
"""
        )

    # Crear archivo models.py
    with open(f"{project_name}/app/models.py", "w") as f:
        f.write(
            """from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
"""
        )

    # Crear archivo run.py
    with open(f"{project_name}/run.py", "w") as f:
        f.write(
            """from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
"""
        )

    # Crear archivo requirements.txt
    with open(f"{project_name}/requirements.txt", "w") as f:
        f.write(
            """Flask
Flask-SQLAlchemy
"""
        )

    print(f"Proyecto Flask '{project_name}' creado exitosamente con SQLite.")

if __name__ == "__main__":
    project_name = input("Nombre del proyecto: ")
    create_flask_project(project_name)