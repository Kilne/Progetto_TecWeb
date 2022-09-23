import pymongo.errors

from backend.database.connection import operation_connection
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from backend.application.hashing import hash_credentials


def user_insert(username: str, password: str, email: str) -> bool:
    """
    Insert a new user into the database.

    :param username: str

    :param password: str

    :param email: str

    :return: bool
    """
    connection_obj = operation_connection()

    verifier = PasswordHasher()

    if connection_obj is False:
        return False

    if connection_obj.get("collection").count_documents({}) != 0:

        existing_user = connection_obj.get("collection").find({}, {"username": 1, "email": 1, "_id": 0})

        for user in existing_user:

            try:
                if verifier.verify(user.get("username"), username) and verifier.verify(user.get("email"), email):
                    existing_user.close()
                    connection_obj.get("client").close()
                    return False
            except VerifyMismatchError:
                continue

        if existing_user.alive:
            existing_user.close()

    try:

        hashed_data = hash_credentials(username, password, email)

        new_user = {
            "username": hashed_data.get("username_hashed"),
            "password": hashed_data.get("password_hashed"),
            "email": hashed_data.get("hashed_email"),
            "user_projects": []
        }

        if connection_obj.get("collection").insert_one(
                new_user
        ).acknowledged:
            connection_obj.get("client").close()
            return True
        else:
            connection_obj.get("client").close()
            return False

    except pymongo.errors.OperationFailure:
        return False
