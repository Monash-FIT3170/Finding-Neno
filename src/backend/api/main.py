import psycopg2
import psycopg2.pool
import sys, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
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


def get_connetion():
    """
    Returns the connection to the database.
    """
    if database_pool is not None:
        return database_pool.getconn()
    else:
        return None
    

"""
Code by Sohaib Farooqi, edited by user956424 on Stack Overflow: https://stackoverflow.com/a/48021571
"""
@app.before_request
def before_request():
   conn = get_connetion()
   g.db = conn

@app.after_request
def after_request(response):
    if g.db is not None:
        g.db.close()
    return response


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
    return insert_user(g.db)

@app.route("/verify_token", methods=["GET"])
def get_verify_token():
    return check_access_token(g.db)

@app.route("/login", methods=["POST"])
def post_login():
    print("logging in")
    data = login(g.db)
    print(data)
    headers = {
        'userId': data[2],
        'accessToken': data[3],
    }

    return data[0], data[1], headers

@app.route("/retrieve_profile", methods=["GET"]) # Requires Access_token and user ID for authorization
def retrieve_profile_information():
    print("retrieving current user profile, ")
    user_id = request.args.get("user_id")
    data = retrieve_profile(g.db, user_id)
    if data[1] == 200:
        return jsonify(data)
    else:
        return None

@app.route("/change_password", methods=["PATCH"]) # Requires Access_token and user ID for authorization
def post_change_password():
    return change_password(g.db)

# pet operations
@app.route("/get_owner_pets", methods=["GET"]) # Requires Access_token and user ID for authorization
def get_owner_pets():
    owner_id = request.args.get("owner_id")
    return get_owner_pets_operation(g.db, owner_id)

@app.route("/get_pet", methods=["GET"])
def get_pet_api():
    pet_id = request.args.get("pet_id")
    return get_pet_operation(g.db, pet_id)

@app.route("/insert_pet", methods=["POST"]) # Requires Access_token and user ID for authorization
def insert_pet():
    owner_id = request.args.get("owner_id")
    print(owner_id)
    return insert_pet_operation(g.db, owner_id)

@app.route("/update_pet", methods=["PUT"]) # Requires Access_token and user ID for authorization
def update_pet_api():
    return update_pet_operation(g.db)

@app.route("/update_missing_status", methods=["PUT"])  # Use PUT method for updating
def toggle_missing_status_api():
    return toggle_missing_status_operation(g.db)

@app.route("/delete_pet", methods=["GET", "DELETE"]) # Requires Access_token and user ID for authorization
def delete_pet_api():
    pet_id = request.args.get("pet_id")
    return delete_pet_operation(g.db, pet_id)


@app.route("/insert_missing_report", methods=["POST"]) # Requires Access_token and user ID for authorization
def post_insert_missing_report():
    return insert_missing_report(g.db)

@app.route("/get_missing_reports", methods=["GET"])
def get_missing_reports():
    """
    Returns an array of all missing reports or missing reports of a user if author_id is provided, sorted by latest to oldest, of the following format.

    [
        missing_report_id, date_time (last seen), description (additional info), location_longitude, location_latitude,
        pet_id, pet_name, pet_animal, pet_breed, image_url,
        owner_id, owner_name, owner_email, owner_phone_number,
        author_id
    ]
    """
    author_id = request.args.get("author_id")
    return jsonify(retrieve_missing_reports(g.db, author_id))

@app.route("/get_reports_by_pet", methods=["GET"])
def get_reports_by_pet():
    """
    Returns an array of missing reports for a specific pet_id, sorted by latest to oldest.
    """
    pet_id = request.args.get("pet_id")
    return jsonify(retrieve_reports_by_pet(g.db, pet_id))  # Updated function name


@app.route("/delete_reports_by_id", methods=["GET", "DELETE"]) # Requires Access_token and user ID for authorization
def delete_reports_by_id_api():
    report_id = request.args.get("report_id")
    return delete_reports_by_id(g.db, report_id)


@app.route("/get_sightings", methods=["GET"])
def get_sightings():
    """
    Returns an array of sightings, sorted by latest to oldest, of the following format.

    [
        sighting_id, missing_report_id, author_id (author of sighting), date_time (date time sighting was made), 
        location_longitude, location_latitude, image_url, description, author's name, author's email, author's phone number, pet_name
    ]
    """
    missing_report_id = request.args.get("missing_report_id")
    return jsonify(retrieve_sightings(g.db, missing_report_id))


@app.route("/get_missing_reports_in_area", methods=["GET"])
def get_missing_reports_in_area():
    """
    Returns an array of missing reports within the provided coordinates and the delta ranges, sorted by latest to oldest, of the following format.

    [
        missing_report_id, date_time (last seen), description (additional info), location_longitude, location_latitude,
        pet_id, pet_name, pet_animal, pet_breed, image_url,
        owner_id, owner_name, owner_email, owner_phone_number
    ]
    """
    longitude = request.args.get("long")
    longitude_delta = request.args.get("long_delta")
    latitude = request.args.get("lat")
    latitude_delta = request.args.get("lat_delta")
    return jsonify(retrieve_missing_reports_in_area(g.db, longitude, longitude_delta, latitude, latitude_delta))


@app.route("/get_sightings_in_area", methods=["GET"])
def get_sightings_in_area():
    """
    Returns an array of sightings within the provided coordinates and the delta ranges, sorted by latest to oldest, of the following format.

    [
        sightings_id, date_time (last seen),location_longitude, location_latitude, sighting description, animal, breed, image_url, 
        missing_report_id, date_time, missing report description,
        owner_id, owner_name, owner_email, owner_phone_number
    ]
    """
    longitude = request.args.get("long")
    longitude_delta = request.args.get("long_delta")
    latitude = request.args.get("lat")
    latitude_delta = request.args.get("lat_delta")
    return jsonify(retrieve_sightings_in_area(g.db, longitude, longitude_delta, latitude, latitude_delta))

@app.route("/get_my_report_sightings", methods=["GET"])
def get_my_report_sightings():
    """
    Returns an array of sightings for the current user's missing reports, sorted by latest to oldest, of the following format.

    [
        sighting_id, missing_report_id, author_id (author of sighting), date_time (date time sighting was made), 
        sighting longitude , sighting latitude, sighting image_url, sighting description, animal, breed, author's name, author's email, author's phone number, pet_name
    ]
    """
    return jsonify(retrieve_my_report_sightings(g.db))


@app.route("/update_missing_report", methods=["PUT"])
def put_update_missing_report():
    return update_missing_report(g.db)

@app.route("/update_report_active_status", methods=["PUT"])  # Use PUT method for updating
def update_report_status_api():
    return update_report_status(g.db)

@app.route("/archive_missing_report", methods=["PUT"]) # Requires Access_token and user ID for authorization
def put_archive_missing_report():
    return archive_missing_report(g.db)

@app.route("/insert_sighting", methods=["POST"]) # Requires Access_token and user ID for authorization
def post_insert_sighting():
    return insert_sighting(g.db)

@app.route("/unlink_sightings", methods=["PUT"]) # Requires Access_token and user ID for authorization
def put_unlink_sightings():
    report_id = request.args.get("report_id")
    return unlink_sightings_by_report(g.db, report_id)

@app.route("/get_sightings_by_report", methods=["GET"])
def get_sightings_by_report():
    report_id = request.args.get("report_id")
    return jsonify(retrieve_sightings_by_id(g.db, report_id))



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

