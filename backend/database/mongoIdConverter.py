from bson import ObjectId


def object_id_converter(item_to_convert: str | ObjectId) -> str | ObjectId:
    """
    Converts the ObjectId to a string
    :param item_to_convert: str | ObjectId
    :return: str | ObjectId
    """
    if type(item_to_convert) == str:
        return ObjectId(item_to_convert)
    else:
        return str(item_to_convert)
