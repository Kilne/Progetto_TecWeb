import os
from typing import Mapping, Any

import pymongo
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import ConnectionFailure


def operation_connection() -> bool | dict[str, MongoClient[Mapping[str, Any]] | Collection[Mapping[str, Any]]]:
    """Connects to the database and returns the collection object

    :returns:  dict[str, MongoClient[Mapping[str, Any]] | Collection[Mapping[str, Any]]]
    """
    try:
        client = pymongo.MongoClient(os.getenv("MONGO_DB_URI"))

        collection = client[os.getenv("MONGO_DB_NAME")][os.getenv("MONGO_DB_COLLECTION")]

        connection_object = {
            "client": client,
            "collection": collection
        }
    except ConnectionFailure:
        return False

    return connection_object
