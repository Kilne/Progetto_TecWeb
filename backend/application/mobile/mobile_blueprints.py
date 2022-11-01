import os
from flask import Blueprint, session, request, json, make_response
from backend.application.log_in_user import log_in_user
from backend.application.registerUser import register_user
from backend.database.Operations.addProject import create_new_project_for_user
from backend.database.Operations.deleteAProject import delete_project
from backend.database.Operations.getProjects import get_projects
from backend.database.Operations.modifyUserDetails import modify_email, modify_password, modify_username
from backend.database.Operations.updateProject import update_project

mobile_bp = Blueprint('mobile_bp', __name__, url_prefix='/mobile')


@mobile_bp.route("/ping_me", methods=['GET'])
def ping():
    if request.method == 'GET':
        return make_response(json.jsonify({'message': 'pong'}), 200)
    else:
        return make_response(json.jsonify({'message': 'Go away'}), 401)


@mobile_bp.route('/login', methods=['POST'])
def login_mobile():
    if request.method == 'POST':

        mobile_data = request.get_json()

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
def get_user_projects():
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


@mobile_bp.route("/delete_projects", methods=["POST"])
def modify_project():
    if request.method == "POST":
        data_of_requester = request.get_json()

        all_completed = True
        completed_dict: dict[str, bool] = {}

        try:
            if data_of_requester["session_id"] == session["session_id"]:

                for ids in data_of_requester["project_ids"]:
                    completed_dict[ids] = delete_project(ids)

                if False in completed_dict.values():
                    all_completed = False

                for id, comp in completed_dict.items():
                    if comp:
                        for project in session["user_projects"]:
                            if project["p_id"] == id:
                                session["user_projects"].remove(project)

                if all_completed:
                    return json.jsonify({"status": True}), 200
                else:
                    return json.jsonify({"status": False, "completed_dict": completed_dict}), 200

        except KeyError:
            return json.jsonify({"status": False}), 401
    else:
        return json.jsonify({"status": False}), 400


@mobile_bp.route("/add_a_project", methods=["POST"])
def add_project_to_user():
    if request.method == "POST":
        data_of_requester = request.get_json()

        try:
            if data_of_requester["session_id"] == session["session_id"]:
                if create_new_project_for_user(session["id"], data_of_requester["new_project"]):
                    session["user_projects"].append(
                        data_of_requester["new_project"])
                    return json.jsonify({"status": True}), 200
                else:
                    return json.jsonify({"status": False}), 200
            else:
                return json.jsonify({"status": False}), 401
        except KeyError:
            return json.jsonify({"status": False}), 401
    else:
        return json.jsonify({"status": False}), 400


@mobile_bp.route("/modify_project", methods=["POST"])
def modify_exisiting_project():
    if request.method == "POST":
        data_of_requester = request.get_json()

        try:

            if data_of_requester["session_id"] == session["session_id"]:

                if (
                    update_project(
                        session["id"],
                        data_of_requester["modified_project"]
                    )
                ):

                    for project in session["user_projects"]:
                        if project["p_id"] == data_of_requester["modified_project"]["p_id"]:
                            session["user_projects"].remove(project)
                            session["user_projects"].append(
                                data_of_requester["modified_project"])
                    return json.jsonify({"status": True}), 200
                else:
                    return json.jsonify({"status": False}), 200

            else:

                return json.jsonify({"status": False}), 401

        except KeyError:

            return json.jsonify({"status": False}), 401
    else:
        return json.jsonify({"status": False}), 400


@mobile_bp.route("/modify_user_details", methods=["POST"])
def modify_details():
    if request.method == "POST":

        user_request: dict[str, str] = request.get_json()

        try:
            if user_request["session_id"] == session["session_id"]:

                successful_changes: dict[str, bool] = {}

                for key in user_request.keys():
                    match key:
                        case "username":
                            if user_request[key] != "":
                                successful_changes[key] = modify_username(
                                    session["id"], user_request[key])
                        case "email":
                            if user_request[key] != "":
                                successful_changes[key] = modify_email(
                                    session["id"], user_request[key])
                        case "password":
                            if user_request[key] != "":
                                successful_changes[key] = modify_password(
                                    session["id"], user_request[key])

                return json.jsonify(successful_changes), 200

            else:
                return json.jsonify({"status": False}), 401

        except KeyError:
            return json.jsonify({"status": False}), 401

    else:
        return json.jsonify({"status": False}), 400
