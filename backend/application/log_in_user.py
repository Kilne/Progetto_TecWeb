from flask import session
from backend.database.verify_credentials import verify_credentials
from backend.database.mongoIdConverter import object_id_converter


def log_in_user(username: str, password: str) -> bool:
    """
    Logs a new user into the application after verifying the credentials.
    :param username: str
    :param password: str
    :return: bool
    """

    user_data = verify_credentials(username, password)

    if type(user_data) is dict:

        session["id"] = object_id_converter(user_data.get("_id"))
        session["username"] = username
        session["user_projects"] = user_data["user_projects"]
        return True
    else:
        return False
