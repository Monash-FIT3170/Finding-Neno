import psycopg2
import os
import secrets
import string
import hashlib


conn = psycopg2.connect(
    dbname=os.getenv("DATABASE_NAME"),
    user=os.getenv("DATABASE_USER"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST"),
    port=os.getenv("DATABASE_PORT"),
)


def salt_and_hash(password,access_token):
    """
    This function is responsible to salt and hash the password it receives
    :Input:
    argv1: password(string)
    :return: hashed password(string)


    """

    salted_password = f"{password}{access_token}"
    hasher = hashlib.sha256()
    hasher.update(salted_password.encode('utf-8'))
    hashed_password = hasher.hexdigest()

    return hashed_password


def generate_access_token():
    # This function generates an 32 character random access token using both letters and numbers

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))

    return token


def insert_user(email, phone, user_name, password):
    # This function is used to add a new user to the database

    cur = conn.cursor()



    # Generate an access token
    access_token = generate_access_token()

    # Hash the password input
    hashed_pass = salt_and_hash(password,access_token)

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, 
    %s);"""

    # Execute the query
    try:
        cur.execute(query, (email, phone, user_name, hashed_pass, access_token))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    conn.commit()
    cur.close()
