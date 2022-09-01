from pymongo.errors import OperationFailure
from backend.database import connection
from backend.database.mongoIdConverter import object_id_converter


def update_project(proj_id: str, project_dict: dict) -> bool:
    conn_obj = connection.operation_connection()

    if conn_obj is False:
        return False

    try:

        if conn_obj.get("collection").update_one(
                {"_id": object_id_converter(proj_id)},
                {"$set": {"user_projects.$[project]": project_dict}},
                array_filters=[{"project.p_id": project_dict["p_id"]}]
        ).modified_count > 0:
            conn_obj.get("client").close()
            return True
        else:
            conn_obj.get("client").close()
            return False

    except OperationFailure:
        return False
