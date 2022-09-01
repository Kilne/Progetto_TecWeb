import pymongo.errors
from backend.database import connection
from flask import session
from backend.database.mongoIdConverter import object_id_converter


def delete_project(project_id: str) -> bool:
    """
    Deletes a project from the database.
    :param project_id: str
    :return: bool
    """
    conn_obj = connection.operation_connection()

    if conn_obj is False:
        return False

    try:

        if conn_obj.get("collection").update_one(
                {
                    "_id": object_id_converter(session["id"])
                },
                {
                    "$pull": {
                        "user_projects": {
                            "p_id": project_id
                        }
                    }
                }
        ).modified_count > 0:
            conn_obj.get("client").close()
            return True
        else:
            conn_obj.get("client").close()
            return False

    except pymongo.errors.OperationFailure:
        conn_obj.get("client").close()
        return False
