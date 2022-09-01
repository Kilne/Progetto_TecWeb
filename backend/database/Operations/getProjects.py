import pymongo.errors

from backend.database import connection
from backend.database.mongoIdConverter import object_id_converter
from datetime import datetime, timedelta


def get_projects(user_id: str) -> list[dict]:
    """
    Gets all projects of a user. Returns an empty list if no projects are found or in case of error.
    It also updates the project times in the database and for the backend use.

    :param user_id: str
    :return: list[dict]
    """
    conn_obj = connection.operation_connection()

    if conn_obj is False:
        return []

    try:
        projects = conn_obj.get("collection").find_one(
            {
                "_id": object_id_converter(user_id)
            }
        )

        current_date: datetime = datetime.now()

        for project in projects["user_projects"]:

            project_due_date: str = project["due_date"]

            project_date: datetime = datetime.fromisoformat(project_due_date.split("Z")[0])

            if project_date >= current_date:
                time_delta: timedelta = project_date - current_date
                project["time_left"]: int = time_delta.days

        conn_obj.get("collection").update_one(
            {"_id": object_id_converter(user_id)},
            {"$set": {"user_projects": projects["user_projects"]}}
        )

        conn_obj.get("client").close()

        return projects["user_projects"]
    except pymongo.errors.OperationFailure:
        return []
