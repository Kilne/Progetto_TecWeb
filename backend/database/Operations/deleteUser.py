import pymongo
import pymongo.errors
from backend.database.connection import operation_connection
from backend.database.mongoIdConverter import object_id_converter


def delete_a_user(user_id: str) -> bool:
    """
    Delete a user from the database.
    
    :param user_id: str
    :return: bool
    """
    conn_obj = operation_connection()

    if conn_obj is bool:
        return False
    else:
        try:

            if conn_obj.get("collection").delete_one(
                    {"_id": object_id_converter(user_id)}
            ).deleted_count == 1:
                conn_obj.get("client").close()
                return True
            else:
                conn_obj.get("client").close()
                return False

        except pymongo.errors.OperationFailure:
            conn_obj.get("client").close()
            return False
