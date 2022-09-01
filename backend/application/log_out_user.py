from flask import session


def log_out_user(username_hashed: str, password_hashed: str) -> bool:
    if session.get("username_hashed") == username_hashed and session.get("password_hashed") == password_hashed:
        session.clear()

        return True
    else:
        return False
