# app/company/__init__.py
from flask import Blueprint

company_bp = Blueprint('company', __name__)

from app.company import routes