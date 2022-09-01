from typing import Mapping, Any

import argon2.exceptions
from argon2 import PasswordHasher
from pymongo.errors import OperationFailure

from backend.database import connection


def verify_credentials(username: str, password: str) -> Mapping[str, Any] | bool:
    """
    Logs a new user into the application after verifying the credentials.

    :param username: str
    :param password: str
    :return: Mapping[str, Any] | bool
    """

    collection_obj = connection.operation_connection()

    user_data: Mapping[str, Any] = dict()

    verifier = PasswordHasher()

    if collection_obj is False:
        return False
    try:

        if collection_obj.get("collection").count_documents({}) == 0:
            return False

        documents = collection_obj.get(
            "collection").find({}, {"username": 1, "password": 1, "_id": 1})

        for document in documents:

            try:
                if verifier.verify(document.get("password"), password) \
                        and verifier.verify(document.get("username"), username):
                    user_data = collection_obj.get("collection").find_one(
                        {
                            "_id": document.get("_id")
                        }
                    )
                    break
            except argon2.exceptions.VerifyMismatchError:
                continue

        if documents.alive:
            documents.close()

    except OperationFailure:
        return False

    if len(user_data) != 0:

        collection_obj.get("client").close()

        return user_data
    else:
        return False
