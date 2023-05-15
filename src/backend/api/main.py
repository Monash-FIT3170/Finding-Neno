import psycopg2
import psycopg2.pool
import sys, os
from dotenv import load_dotenv
from flask import Flask, request

from user_service import insert_user, change_password, login, insert_missing_report, retrieve_missing_reports_of_user


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


@app.route("/insert_user", methods=["POST"])
def post_insert_user():
    return insert_user(get_connection())

@app.route("/login", methods=["POST"])
def post_login():
    return login(get_connection())

@app.route("/change_password", methods=["PATCH"])
def post_change_password():
    return change_password(get_connection())

@app.route("/insert_missing_report", methods=["POST"])
def post_insert_missing_report():
    return insert_missing_report(get_connection())

@app.route("/get_missing_reports", methods=["GET"])
def get_missing_reports_of_user():
    return retrieve_missing_reports_of_user(get_connection())
    

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

