import argon2


def hash_credentials(username: str, password: str, email: str | None = None) -> dict[str, str]:
    """
    Hashes the credentials of the user.

    :param email: str
    :param username: str
    :param password: str
    :return: dict[str, str]
    """

    hasher = argon2.PasswordHasher()

    if email is None:
        hashed_data = {
            "username_hashed": hasher.hash(username),
            "password_hashed": hasher.hash(password),
        }
    else:
        hashed_data = {
            "username_hashed": hasher.hash(username),
            "password_hashed": hasher.hash(password),
            "hashed_email": hasher.hash(email),
        }

    return hashed_data
