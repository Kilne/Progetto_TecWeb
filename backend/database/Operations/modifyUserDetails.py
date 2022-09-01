import pymongo
import pymongo.errors
from backend.database.connection import operation_connection
from backend.database.mongoIdConverter import object_id_converter
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


def _checker_(new: str, old: str) -> bool:
    """
    Check if the new data is the same as the old one.

    :param new: str
    :param old: str
    :return: bool
    """
    checker = PasswordHasher()

    try:
        if checker.verify(old, new):
            return True
    except VerifyMismatchError:
        return False


def _existing_details_(new: str) -> bool:

    conn_obj = operation_connection()
    existing_data = conn_obj.get("collection").find({})

    for data in existing_data:
        for key, value in data.items():
            if key == "username":
                if _checker_(new, value):
                    return True
            elif key == "email":
                if _checker_(new, value):
                    return True
            else:
                continue

    if existing_data.alive:
        existing_data.close()

    return False


def modify_username(user_id: str, new_username: str) -> bool:
    """
    Modify the username of a user.

    :param user_id: str
    :param new_username: str
    :return: bool
    """
    conn_obj = operation_connection()

    hasher = PasswordHasher()

    if conn_obj is bool:
        return False
    else:
        try:

            if _existing_details_(new_username) is False:

                if conn_obj.get("collection").update_one(
                        {"_id": object_id_converter(user_id)},
                        {"$set": {"username": hasher.hash(new_username)}}
                ).modified_count == 1:
                    conn_obj.get("client").close()
                    return True
                else:
                    conn_obj.get("client").close()
                    return False
            else:
                conn_obj.get("client").close()
                return False
        except pymongo.errors.OperationFailure:
            conn_obj.get("client").close()
            return False


def modify_password(user_id: str, new_password: str) -> bool:
    """
    Modify the password of a user.

    :param user_id: str
    :param new_password: str
    :return: bool
    """
    conn_obj = operation_connection()

    hasher = PasswordHasher()

    if conn_obj is bool:
        return False
    else:
        try:

            if _checker_(
                    new_password,
                    conn_obj.get("collection").find_one(
                        {"_id": object_id_converter(user_id)}
                    )["password"]
            ) is False:

                if conn_obj.get("collection").update_one(
                        {"_id": object_id_converter(user_id)},
                        {"$set": {"password": hasher.hash(new_password)}}
                ).modified_count == 1:
                    conn_obj.get("client").close()
                    return True
                else:
                    conn_obj.get("client").close()
                    return False
            else:
                conn_obj.get("client").close()
                return False
        except pymongo.errors.OperationFailure:
            conn_obj.get("client").close()
            return False


def modify_email(user_id: str, new_email: str) -> bool:
    """
    Modify the email of a user.

    :param user_id: str
    :param new_email: str
    :return: bool
    """
    conn_obj = operation_connection()

    hasher = PasswordHasher()

    if conn_obj is bool:
        return False
    else:
        try:

            if _existing_details_(new_email):

                if conn_obj.get("collection").update_one(
                        {"_id": object_id_converter(user_id)},
                        {"$set": {"email": hasher.hash(new_email)}}
                ).modified_count == 1:
                    conn_obj.get("client").close()
                    return True
                else:
                    conn_obj.get("client").close()
                    return False
            else:
                conn_obj.get("client").close()
                return False
        except pymongo.errors.OperationFailure:
            conn_obj.get("client").close()
            return False
