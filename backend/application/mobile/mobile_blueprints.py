from datetime import datetime
import os
from flask import Blueprint, session, request, json
from backend.application.log_in_user import log_in_user
from backend.application.registerUser import register_user
from backend.database.Operations.getProjects import get_projects

mobile_bp = Blueprint('mobile_bp', __name__, url_prefix='/mobile')


@mobile_bp.route('/login', methods=['POST'])
def login_mobile():
    if request.method == 'POST':

        mobile_data = request.get_json()
        try:
            if mobile_data["session_id"] == session["session_id"]:
                return json.jsonify({"status": "success"}), 204
        except KeyError:
            if log_in_user(mobile_data["username"], mobile_data["password"]):
                session["session_id"] = os.urandom(24).hex()
                if len(session["user_projects"]) == 0:
                    return json.jsonify(
                        {
                            "id": session["id"],
                            "username": session["username"],
                            "user_projects": [],
                            "session_id": session["session_id"]
                        }
                    ), 200
                else:
                    return json.jsonify({
                        "id": session["id"],
                        "username": session["username"],
                        "user_projects": session["user_projects"],
                        "session_id": session["session_id"]
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


@mobile_bp.route('/register', methods=['POST'])
def register_mobile():
    if request.method == 'POST':
        data = request.get_json()

        if register_user(data["username"], data["password"], data["email"]):
            session["session_id"] = os.urandom(24).hex()
            return json.jsonify(
                {"id": session["id"],
                 "username": session["username"],
                 "user_projects": session["user_projects"],
                 "session_id": session["session_id"]
                 }), 200
        else:
            return json.jsonify({"status": False}), 401

    else:
        return json.jsonify({"status": False}), 400

@mobile_bp.route("/get_project", methods=["POST"])
def getProjects():
    if request.method == "POST":
        data_of_requester = request.get_json()
        try:
            if data_of_requester["session_id"] == session["session_id"]:
                session["user_projects"] = get_projects(session["id"])
                if len(session["user_projects"]) == 0:
                    return json.jsonify({"user_projects": []}), 200
                else:
                    return json.jsonify({"user_projects": session["user_projects"]}), 200
        except KeyError:
            return json.jsonify({"status": False}), 401
    else:
        return json.jsonify({"status": False}), 400