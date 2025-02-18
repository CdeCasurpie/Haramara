# app/client/__init__.py
from flask import Blueprint

client_bp = Blueprint('client', __name__)

from app.client import routes