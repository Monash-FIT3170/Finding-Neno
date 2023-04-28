from flask import Flask, request, jsonify
import psycopg2
import sys
import os
from dotenv import load_dotenv

from db.users_operations import insert_user


app = Flask(__name__)
conn = None

@app.route('/')
def root():
    return 'Finding Neno Server is Up!'

@app.route('/insert_user', methods=['POST'])
def post_insert_user():
    json_data = request.get_json(force=True) 
    print('inserting user: ', json_data)
    email = json_data['email']
    phoneNumber = json_data['phoneNumber']
    password = json_data['password']
    username = 'John' # TODO signup with username?
    insert_user(conn, email, phoneNumber, username, password)
    return '', 201  
    





if __name__ == '__main__':

    # Get environment file path from command line arguments
    if len(sys.argv) < 2:
        raise Exception("No environment file path provided - see top of this file for instructions")
    environment_file_path = sys.argv[1]
    if environment_file_path is None or environment_file_path == "":
        raise Exception("No environment file path provided - see top of this file for instructions")
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

        app.run(host='0.0.0.0', debug=True)