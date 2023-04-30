import psycopg2
import os
import secrets
import string

conn = psycopg2.connect(
    dbname=os.getenv("DATABASE_NAME"),
    user=os.getenv("DATABASE_USER"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST"),
    port=os.getenv("DATABASE_PORT"),
)

def salt_and_hash(password): #TODO: IMPLEMENT

    return ""

def generate_access_token(): #TODO: IMPLEMENT

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))

    return token

def insert_user(email, phone, user_name, password):

    cur = conn.cursor()

    hashed_pass = salt_and_hash(password)

    access_token = generate_access_token()

    query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, %s);"""

    # Execute the query

    try:
        cur.execute(query, (email, phone, user_name, hashed_pass, access_token))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    conn.commit()
    cur.close()