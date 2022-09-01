from flask import session

from backend.database.Operations.userInsert import user_insert
from backend.database.mongoIdConverter import object_id_converter
from backend.database.verify_credentials import verify_credentials


def register_user(username: str, password: str, email: str) -> bool:
    """
    Registers a new user into the application.
    :param username: str
    :param password: str
    :param email: str
    :return: bool
    """

    if user_insert(username, password, email):

        session["id"] = object_id_converter(
            verify_credentials(username, password).get("_id")
        )
        session["username"] = username
        session["user_projects"] = []

        return True
    else:
        return False
