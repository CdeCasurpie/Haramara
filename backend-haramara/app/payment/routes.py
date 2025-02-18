# app/payment/routes.py
from app.payment import payment_bp

@payment_bp.route('/payment')
def get_payment():
    return 'Payment! Hello from payment_bp'