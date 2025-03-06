# app/company/__init__.py
from flask import Blueprint
from app.company.activity_routes import activity_bp
from app.company.cursos_routes import cursos_bp
from app.company.productos_bp import productos_bp
from app.company.empresa_routes import empresa_bp


company_bp = Blueprint('company', __name__)
company_bp.register_blueprint(activity_bp)
company_bp.register_blueprint(cursos_bp)
company_bp.register_blueprint(productos_bp) 
company_bp.register_blueprint(empresa_bp)

from app.company import routes