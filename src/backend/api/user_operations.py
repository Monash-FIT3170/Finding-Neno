from flask import request, jsonify
from pathlib import Path
import sys

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.users_operations import insert_user

def insert_user():
    json_data = request.get_json(force=True)
    print("inserting user: ", json_data)
    email = json_data["email"]
    phoneNumber = json_data["phoneNumber"]
    password = json_data["password"]
    name = json_data["name"]
    insert_user(conn, email, phoneNumber, name, password)
    return "", 201
