import psycopg2
import psycopg2.pool
import sys, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import flask

from user_service import insert_user, change_password, login, insert_missing_report, retrieve_missing_reports, update_missing_report, archive_missing_report
from pets_api import get_owner_pets_operation, get_pet_operation, insert_pet_operation, update_pet_operation, \
    delete_pet_operation

database_pool = None

app = Flask(__name__)


def create_database_pool():
    """
    Creates a PostgreSQL connection pool which can be accessed by multiple instances.
    """
    return psycopg2.pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
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
        'accessToken': data[3]
    }

    return data[0], data[1], headers

@app.route("/change_password", methods=["PATCH"])
def post_change_password():
    return change_password(get_connection())

# pet operations
@app.route("/get_owner_pets/<owner_id>", methods=["GET"])
def get_owner_pets(owner_id):
    print("conected to api")
    return get_owner_pets_operation(get_connection(), owner_id)

@app.route("/get_pet/<pet_id>", methods=["GET"])
def get_pet_api(pet_id):
    return get_pet_operation(get_connection(), pet_id)

@app.route("/insert_pet", methods=["POST"])
def insert_pet():
    owner_id = request.args.get("owner_id")
    print(owner_id)
    return insert_pet_operation(get_connection(), owner_id)

@app.route("/update_pet", methods=["PUT"])
def update_pet_api():
    return update_pet_operation(get_connection())

@app.route("/delete_pet/<pet_id>", methods=["DELETE"])
def delete_pet_api(pet_id):
    return delete_pet_operation(get_connection(), pet_id)


@app.route("/insert_missing_report", methods=["POST"])
def post_insert_missing_report():
    return insert_missing_report(get_connection())

@app.route("/get_missing_reports", methods=["GET"])
def get_missing_reports():
    """
    Returns an array of missing reports, sorted by latest to oldest, of the following format.

    [
        missing_report_id, date_time (last seen), description (additional info), location_longitude, location_latitude,
        pet_id, pet_name, pet_animal, pet_breed, 
        owner_id, owner_name, owner_email, owner_phone_number
    ]
    """
    owner_id = request.args.get("owner_id")
    return jsonify(retrieve_missing_reports(get_connection(), owner_id))

@app.route("/update_missing_report", methods=["PUT"])
def put_update_missing_report():
    return update_missing_report(get_connection())

@app.route("/archive_missing_report", methods=["PUT"])
def put_archive_missing_report():
    return archive_missing_report(get_connection())
    

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

