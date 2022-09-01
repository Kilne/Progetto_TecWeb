from pymongo.errors import OperationFailure

from backend.database.connection import operation_connection
from backend.database.mongoIdConverter import object_id_converter


def create_new_project_for_user(user_id: str, new_project: dict) -> bool:
    """
    Creates a new project for the user.

    :param user_id: str
    :param new_project: dict
    :return: bool
    """
    conn_obj = operation_connection()

    try:

        if conn_obj.get("collection").update_one(
                {"_id": object_id_converter(user_id)},
                {"$addToSet": {"user_projects": new_project}}
        ).modified_count >= 0:
            return True
        else:
            return False

    except OperationFailure:
        return False
