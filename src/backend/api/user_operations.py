from flask import Flask, request, jsonify
import psycopg2
import psycopg2.pool
import sys, os
from dotenv import load_dotenv
from pathlib import Path

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.users_operations import insert_user

app = Flask(__name__)
conn = None
database_pool = None

def create_database_pool():
    return psycopg2.pool.SimpleConnectionPool(
        minconn=1,
        maxconn=10,
        dbname=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT")
    )


@app.route("/")
def root():
    return "Finding Neno Server is Up!"


@app.route("/insert_user", methods=["POST"])
def post_insert_user():
    json_data = request.get_json(force=True)
    print("inserting user: ", json_data)
    email = json_data["email"]
    phoneNumber = json_data["phoneNumber"]
    password = json_data["password"]
    username = "John"  # TODO signup with username?
    insert_user(conn, email, phoneNumber, username, password)
    return "", 201

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


def get_db():
    if database_pool is not None:
        return database_pool