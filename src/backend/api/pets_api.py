import flask
from flask import request, jsonify
import sys

from pathlib import Path

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.pets import *


def get_owner_pets_operation(conn, owner_id):
    access_token = request.headers.get('Authorization').split('Bearer ')[1]

    db_output = get_all_pets(connection=conn, owner_id=owner_id, access_token=access_token)

    print(db_output)

    if db_output is False:
        return "Authentication failed", 401
    else:
        return jsonify(db_output)


def get_pet_operation(conn, pet_id):

    data = request.get_json(force=True)
    user_id = data["id"]
    access_token = request.headers.get('Authorization').split('Bearer ')[1]

    db_output = get_pet(connection=conn, pet_id=pet_id, user_id=user_id, access_token=access_token)
    return jsonify(db_output)


def insert_pet_operation(conn, owner_id):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]

    print(data)

    pet = add_pet(
        connection=conn,
        name=data["name"],
        animal=data["animal"],
        breed=data["breed"],
        description=data["description"],
        image_url=data["image_url"],
        owner_id=owner_id,
        access_token=token
    )
    if pet:
        return "", 201
    return ""


def update_pet_operation(conn):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]

    success = edit_pet(
        connection=conn,
        id=data["id"],
        name=data["name"],
        animal=data["animal"],
        breed=data["breed"],
        description=data["description"],
        image_url=data["image_url"],
        owner_id=data["owner_id"],
        access_token=token
    )
    if success:
        return "", 201
    return ""


def delete_pet_operation(conn, pet_id):
    token = request.headers.get('Authorization').split('Bearer ')[1]

    success = delete_pet(
        connection=conn,
        id=pet_id,
        access_token=token
    )
    if success:
        return "", 201
    return ""



