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
    email = json_data["email"].lower()
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

