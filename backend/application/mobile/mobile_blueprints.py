from flask import Blueprint, session, request
from backend.application.log_in_user import log_in_user

mobile_bp = Blueprint('mobile_bp', __name__, url_prefix='/mobile')


@mobile_bp.route('/login', methods=['POST'])
def login_mobile():
    if request.method == 'POST':

        return "logged in", 200
    else:
        return "Unauthorized", 401


@mobile_bp.route('/logout', methods=['GET'])
def logout_mobile():
    if request.method == 'GET':
        print(request.headers)
        session.clear()
        return "Logged Out", 200
    else:
        return "Unauthorized", 401
