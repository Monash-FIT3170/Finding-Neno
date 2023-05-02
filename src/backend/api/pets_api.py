import flask
from flask import Flask, request, jsonify
import psycopg2
import os
from dotenv import load_dotenv
import sys
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
    return "", 201


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
        app.run(debug=True)



