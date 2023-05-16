import flask
from flask import Flask, request, jsonify
import psycopg2
import os
from dotenv import load_dotenv
import sys

from pathlib import Path

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.pets import *

app = Flask(__name__)


@app.route("/get_owner_pets/<owner_id>")
def get_owner_pets(owner_id):
    auth_header = flask.request.headers.get('Authorization')
    token = auth_header.split()[1]

    db_output = get_all_pets(connection=conn, owner_id=owner_id, access_token=token)
    return jsonify(db_output)


@app.route("/get_pet/<pet_id>")
def get_pet_api(pet_id):
    db_output = get_pet(connection=conn, pet_id=pet_id)
    return jsonify(db_output)


@app.route("/insert_pet", methods=["POST"])
def insert_pet():
    data = request.get_json()
    auth_header = flask.request.headers.get('Authorization')
    token = auth_header.split()[1]

    pet = add_pet(
        connection=conn,
        name=data["name"],
        animal=data["animal"],
        breed=data["breed"],
        description=data["description"],
        image_url=data["image_url"],
        owner_id=data["owner_id"],
        access_token=token
    )
    if pet:
        return "", 201
    return ""


@app.route("/update_pet", methods=["PUT"])
def update_pet_api():
    data = request.get_json()
    auth_header = flask.request.headers.get('Authorization')
    token = auth_header.split()[1]

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


@app.route("/delete_pet/<pet_id>", methods=["DELETE"])
def delete_pet_api(pet_id):
    auth_header = flask.request.headers.get('Authorization')
    token = auth_header.split()[1]

    success = delete_pet(
        connection=conn,
        id=pet_id,
        access_token=token
    )
    if success:
        return "", 201
    return ""


if __name__ == '__main__':
    # Get environment file path from command line arguments
    if len(sys.argv) < 2:
        raise Exception("No environment file path provided")
    environment_file_path = sys.argv[1]
    if environment_file_path is None or environment_file_path == "":
        raise Exception("No environment file path provided")
    else:
        # Load environment variables
        load_dotenv(environment_file_path)

        # Connect to your postgres DB
        conn = psycopg2.connect(
            dbname=os.getenv("DATABASE_NAME"),
            user=os.getenv("DATABASE_USER"),
            password=os.getenv("DATABASE_PASSWORD"),
            host=os.getenv("DATABASE_HOST"),
            port=os.getenv("DATABASE_PORT"),
        )
        app.run(host="0.0.0.0", debug=True)



