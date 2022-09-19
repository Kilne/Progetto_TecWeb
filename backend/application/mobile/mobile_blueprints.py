from flask import Blueprint, session, request, json
from backend.application.log_in_user import log_in_user

mobile_bp = Blueprint('mobile_bp', __name__, url_prefix='/mobile')


@mobile_bp.route('/login', methods=['POST'])
def login_mobile():
    if request.method == 'POST':

        mobile_data = request.get_json()

        if log_in_user(mobile_data["username"], mobile_data["password"]):
            session["username"] = mobile_data["username"]
            return json.jsonify({
                "username": session["username"],
                "projects": session["user_projects"]
            }), 200
        else:
            return json.jsonify({"status": False}), 401
    else:
        return json.jsonify({"status": False}), 400


@mobile_bp.route('/logout', methods=['GET'])
def logout_mobile():
    if request.method == 'GET':
        session.clear()
        return json.jsonify({"status": True}), 200
    else:
        return json.jsonify({"status": False}), 400
