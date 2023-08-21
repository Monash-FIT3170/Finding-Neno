import psycopg2
import psycopg2.pool
import sys, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import flask

from user_service import *
from pets_api import *

database_pool = None

app = Flask(__name__)


def create_database_pool():
    """
    Creates a PostgreSQL connection pool which can be accessed by multiple instances.
    """
    return psycopg2.pool.SimpleConnectionPool(
        minconn=1,
        maxconn=1000,
        dbname=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT")
    )


def get_connection():
    """
    Returns the connection to the database.
    """
    if database_pool is not None:
        return database_pool.getconn()
    else:
        return None
    
@app.route("/")
def root():
    return "Finding Neno Server is Up!"

@app.route("/manual_start_connection")
def manual_start_database_pool():
    create_database_pool()
    return "Database pool has been manually created successfully"

@app.route("/close_connection")
def close_connection():
    database_pool.closeall()
    return "Connection closed successfully"

@app.route("/insert_user", methods=["POST"])
def post_insert_user():
    return insert_user(get_connection())

@app.route("/login", methods=["POST"])
def post_login():
    print("logging in")
    data = login(get_connection())
    print(data)
    headers = {
        'userId': data[2],
        'accessToken': data[3],
    }


    return data[0], data[1], headers

@app.route("/retrieve_profile/<user_id>", methods=["GET"]) # Requires Access_token and user ID for authorization
def retrieve_profile_information(user_id):
    print("retrieving current user profile, ")
    data = retrieve_profile(get_connection(), user_id)
    if data[2] == 401:
        info = {
            'name': data[2],
            'email': data[3],
            'phone': data[4]
        }
        return jsonify(info), data[1]
    else:
        return data

@app.route("/change_password", methods=["PATCH"]) # Requires Access_token and user ID for authorization
def post_change_password():
    return change_password(get_connection())

# pet operations
@app.route("/get_owner_pets/<owner_id>", methods=["GET"]) # Requires Access_token and user ID for authorization
def get_owner_pets(owner_id):
    print("conected to api")
    return get_owner_pets_operation(get_connection(), owner_id)

@app.route("/get_pet/<pet_id>", methods=["GET"])
def get_pet_api(pet_id):
    return get_pet_operation(get_connection(), pet_id)

@app.route("/insert_pet", methods=["POST"]) # Requires Access_token and user ID for authorization
def insert_pet():
    owner_id = request.args.get("owner_id")
    print(owner_id)
    return insert_pet_operation(get_connection(), owner_id)

@app.route("/update_pet", methods=["PUT"]) # Requires Access_token and user ID for authorization
def update_pet_api():
    return update_pet_operation(get_connection())

@app.route("/delete_pet/<pet_id>", methods=["DELETE"]) # Requires Access_token and user ID for authorization
def delete_pet_api(pet_id):
    return delete_pet_operation(get_connection(), pet_id)


@app.route("/insert_missing_report", methods=["POST"]) # Requires Access_token and user ID for authorization
def post_insert_missing_report():
    return insert_missing_report(get_connection())

@app.route("/get_missing_reports", methods=["GET"])
def get_missing_reports():
    """
    Returns an array of missing reports, sorted by latest to oldest, of the following format.

    [
        missing_report_id, date_time (last seen), description (additional info), location_longitude, location_latitude,
        pet_id, pet_name, pet_animal, pet_breed, image_url,
        owner_id, owner_name, owner_email, owner_phone_number
    ]
    """
    owner_id = request.args.get("owner_id")
    return jsonify(retrieve_missing_reports(get_connection(), owner_id))

@app.route("/get_sightings", methods=["GET"])
def get_sightings():
    """
    Returns an array of sightings, sorted by latest to oldest, of the following format.

    [
        sighting_id, missing_report_id, author_id (author of sighting), date_time (date time sighting was made), 
        location_longitude, location_latitude, image_url, description, author's name, author's email, author's phone number
    ]
    """
    missing_report_id = request.args.get("missing_report_id")
    return jsonify(retrieve_sightings(get_connection(), missing_report_id))


@app.route("/update_missing_report", methods=["PUT"])
def put_update_missing_report():
    return update_missing_report(get_connection())

@app.route("/archive_missing_report", methods=["PUT"]) # Requires Access_token and user ID for authorization
def put_archive_missing_report():
    return archive_missing_report(get_connection())

@app.route("/insert_new_sighting", methods=["POST"]) # Requires Access_token and user ID for authorization
def post_insert_new_sighting():
    return insert_new_sighting(get_connection())
    

if __name__ == "__main__": 
    # Get environment file path from command line arguments
    if len(sys.argv) < 2:
        raise Exception(
            "No environment file path provided - see top of this file for instructions"
        )
    environment_file_path = sys.argv[1]
    if environment_file_path is None or environment_file_path == "":
        raise Exception(
            "No environment file path provided - see top of this file for instructions"
        )
    else:
        # Load environment variables
        load_dotenv(environment_file_path)

        database_pool = create_database_pool()

        app.run(host="0.0.0.0", debug=True)

