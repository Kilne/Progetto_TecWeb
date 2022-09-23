import mimetypes
import os
import datetime
from typing import Any

import werkzeug.exceptions
from dotenv import load_dotenv, find_dotenv
from flask import Flask, render_template, session, request, url_for, jsonify, redirect, make_response, \
    send_from_directory
from flask_cors import cross_origin

from backend.application.mobile.mobile_blueprints import mobile_bp
from backend.application.checkIfLogged import check_if_already_logged_in
from backend.application.log_in_user import log_in_user
from backend.application.registerUser import register_user
from backend.database.Operations.getProjects import get_projects
from backend.database.Operations.addProject import create_new_project_for_user
from backend.database.Operations.deleteAProject import delete_project
from backend.database.Operations.updateProject import update_project
from backend.database.Operations.deleteUser import delete_a_user
from backend.database.Operations.modifyUserDetails import modify_password, modify_email, modify_username

# ENVIRONMENT VARIABLES
load_dotenv(find_dotenv())
# Type fix for windows
mimetypes.add_type('text/javascript', '.js')
# FLASK APP
app = Flask(__name__)
app.register_blueprint(mobile_bp)
# CORS
cross_origin(app)
# Session lifetime and key
app.secret_key = os.getenv("SECRET_KEY")


# SESSION REFRESH
@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(days=1)


# ROUTES

@app.route("/home", methods=["GET"])
@cross_origin()
def index():
    if check_if_already_logged_in():
        return redirect(url_for("logged_index"), code=302)
    return render_template("index.html")


@app.route("/loggedIndex", methods=["GET"])
@cross_origin()
def logged_index():
    if request.method == "GET":
        if check_if_already_logged_in():
            return render_template("loggedIndex.html")
        else:
            return redirect(url_for("index"), code=302)
    else:
        return "Forbidden", 403


@app.route("/home/user", methods=["GET"])
@cross_origin()
def logged_data():
    if request.method == "GET":
        try:
            return jsonify({"username": session["username"]})
        except KeyError:
            return jsonify({"username": ""})


@app.route("/projects", methods=["GET"])
@cross_origin()
def projects():
    if request.method == "GET":
        if check_if_already_logged_in():
            return render_template("projects.html", user=session["username"])
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/projects/data", methods=["POST"])
@cross_origin()
def projects_data():
    if request.method == "POST":

        session["user_projects"] = get_projects(session["id"])
        try:
            if len(session["user_projects"]) == 0:
                return jsonify({"data": False})
            else:
                return jsonify({"data": session["user_projects"]})
        except KeyError:
            return jsonify({"data": False})

    else:
        return 403, "Forbidden"


@app.route("/projects/create", methods=["POST"])
@cross_origin()
def create_project():
    if request.method == "POST":
        if check_if_already_logged_in():
            try:
                the_new_project = request.get_json()

                if create_new_project_for_user(session["id"], the_new_project):
                    session["user_projects"].append(the_new_project)
                    return jsonify({"data": True})
                else:
                    return jsonify({"data": False})

            except KeyError:
                return jsonify({"data": False})
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/projects/delete", methods=["POST"])
@cross_origin()
def delete_a_project():
    if request.method == "POST":
        if check_if_already_logged_in():
            try:
                the_project_to_delete: dict[str, list[str]] = request.get_json()

                total_projects_to_delete = len(the_project_to_delete["project_id"])

                projects_deleted = 0

                for for_delete in the_project_to_delete["project_id"]:
                    if delete_project(for_delete):

                        for projs in session["user_projects"]:
                            if projs["p_id"] == for_delete:
                                session["user_projects"].remove(projs)
                                projects_deleted += 1

                if projects_deleted == total_projects_to_delete:
                    return jsonify({"data": True})
                else:
                    return jsonify({"partial": True})

            except KeyError:
                return jsonify({"data": False})
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/projects/details", methods=["GET"])
@cross_origin()
def project_details():
    if request.method == "GET":
        if check_if_already_logged_in():
            return render_template("projectpage.html")
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/projects/open", methods=["POST"])
@cross_origin()
def open_project():
    if request.method == "POST":
        if check_if_already_logged_in():

            try:

                the_project_to_open = request.get_json()
                session["project_to_open"] = the_project_to_open["project_id"]

                return jsonify({"data": True})

            except KeyError:
                return jsonify({"data": False})

        else:
            return redirect(url_for("index"), code=302)

    else:
        return 403, "Forbidden"


@app.route("/projects/populate", methods=["GET"])
@cross_origin()
def populate_project():
    if request.method == "GET":
        if check_if_already_logged_in():
            try:

                for proj in session["user_projects"]:
                    if proj["p_id"] == session["project_to_open"]:
                        return jsonify({"data": proj})

            except KeyError:
                return jsonify({"data": False})
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/projects/update", methods=["POST"])
@cross_origin()
def update_a_project():
    if request.method == "POST":
        if check_if_already_logged_in():

            try:

                the_project_to_update = request.get_json()
                if update_project(session["id"], the_project_to_update["updated_project"]):

                    user_proj: list[dict[str, Any]] = session["user_projects"]

                    for elements in user_proj:
                        if elements["p_id"] == the_project_to_update["updated_project"]["p_id"]:
                            user_proj[user_proj.index(elements)] = the_project_to_update["updated_project"]
                            session["user_projects"] = user_proj
                            break

                    return jsonify({"data": True})

                else:
                    return jsonify({"data": False})

            except KeyError:
                return jsonify({"data": False})

        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    if request.method == "POST":

        try:
            json_data = request.get_json()
        except werkzeug.exceptions.BadRequest:
            return 400, "Bad Request"

        if log_in_user(json_data["username"], json_data["password"]):
            return jsonify({"Response": True, "Redirect": url_for("projects")}), 302
        else:
            return jsonify({"Response": False}), 401
    else:
        return 403, "Forbidden"


@app.route("/logout", methods=["GET"])
def logout():
    if request.method == "GET":
        session.clear()
        return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/signup", methods=["POST"])
@cross_origin()
def signup():
    if request.method == "POST":

        user_details = request.get_json()

        if register_user(user_details["username"], user_details["password"], user_details["email"]):
            return jsonify({"Response": True, "Redirect": url_for("projects")}), 302
        else:
            return jsonify({"Response": False}), 401
    else:
        return 403, "Forbidden"


@app.route("/user", methods=["GET"])
@cross_origin()
def home_user():
    if request.method == "GET":
        if check_if_already_logged_in():
            return render_template("user.html", user=session["username"])
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/user/delete", methods=["POST"])
@cross_origin()
def delete_user():
    if request.method == "POST":
        if check_if_already_logged_in():
            try:
                user_confirms = request.get_json()

                if user_confirms["confirms"]:
                    if delete_a_user(session["id"]):
                        session.clear()
                        return jsonify({"data": True})
                    else:
                        return jsonify({"data": False})
                else:
                    return jsonify({"data": False})

            except KeyError:
                return jsonify({"data": False})
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/user/update", methods=["POST"])
@cross_origin()
def update_user():
    if request.method == "POST":
        if check_if_already_logged_in():
            try:
                user_details: dict = request.get_json()
                for key in user_details.keys():
                    match key:
                        case "username":
                            if modify_username(session["id"], user_details["username"]):
                                session["username"] = user_details["username"]
                                return jsonify({"data": True})
                            else:
                                return jsonify({"data": False})
                        case "password":
                            if modify_password(session["id"], user_details["password"]):
                                return jsonify({"data": True})
                            else:
                                return jsonify({"data": False})
                        case "email":
                            if modify_email(session["id"], user_details["email"]):
                                return jsonify({"data": True})
                            else:
                                return jsonify({"data": False})
                        case _:
                            return jsonify({"data": False})

            except KeyError:
                return jsonify({"data": False})
        else:
            return redirect(url_for("index"), code=302)
    else:
        return 403, "Forbidden"


@app.route("/sw.js", methods=["GET"])
def sw():
    res = make_response(send_from_directory("static", "./PWA/sw.js"))
    res.headers["Content-Type"] = "application/javascript"
    res.headers.add("Service-Worker-Allowed", "/")
    return res


@app.route("/css/bulma.css", methods=["GET"])
def bulma():
    return make_response(send_from_directory("static", "./css/bulma.css"))


@app.route("/css/bulma-rtl.css", methods=["GET"])
def bulma_rtl():
    return make_response(send_from_directory("static", "./css/bulma-rtl.css"))


@app.route("/css/mycss.css", methods=["GET"])
def mycss():
    return make_response(send_from_directory("static", "./css/mycss.css"))


if __name__ == '__main__':
    app.run(
        host='localhost',
        port=5000,
    )
