from flask import request, jsonify
from pathlib import Path
import sys

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.users_operations import insert_user_to_database, change_password_in_database

def insert_user(conn):
    json_data = request.get_json(force=True)
    print("inserting user: ", json_data)
    email = json_data["email"].toLowerCase()
    phoneNumber = json_data["phoneNumber"]
    password = json_data["password"]
    name = json_data["name"]
    insert_user_to_database(conn, email, phoneNumber, name, password)
    return "", 201


def change_password(connection):
    """
    This function receives the user inputs and calls the change_password_in_database function to change password.
    """
    json_data = request.get_json(force=True)
    email = json_data["email"].toLowerCase()
    new_password = json_data["password"]
    change_password_in_database(connection = connection, email = email, new_password = new_password)
    return "", 200

def validate_password_reset(username, reset_token, new_password):
    if not verify_username(username):
        return False
    if not verify_reset_token(username, reset_token):
        return False
#validate new password
    if not verify_password_requirements(new_password):
        return False

        """
        Reset password and update user credentials
        """
    reset_password(username, new_password)
    return True


def verify_username(username):
    # To Check if username exists in database
    # Perform necessary validations such as username format, uniqueness
    # Return True if the username is valid; otherwise, return False
    return True  # Placeholder, replace with validation logic


def verify_reset_token(username, reset_token):
    # Verify if the reset token is valid for the given username
    # Perform necessary validations (e.g., token expiration, uniqueness, etc.)
    # Return True if the token is valid; otherwise, return False
    return True  # Placeholder, replace with actual validation logic


def verify_password_requirements(password):
    """
    Perform password validation
    """

    # Return True if the password meets the requirements; otherwise, return False
    if len(password) < 8:
        return False
    if not any(char.isdigit() for char in password):
        return False
    if not sys.search(r'[A-Za-z]', password):
        return False
    return True


def reset_password(username, new_password):
    # Update  user's password in database
    # Return True if the password reset was successful; otherwise, return False
    return True
    # Replace with password reset
