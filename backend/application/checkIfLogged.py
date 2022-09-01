from flask import session


def check_if_already_logged_in() -> bool:
    """
    Checks if the user is already logged in.
    :return: bool
    """
    try:
        if session.get("username") is not None:
            return True
    except KeyError:
        return False
