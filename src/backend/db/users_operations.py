import psycopg2
import os
from dotenv import load_dotenv
import sys

conn = psycopg2.connect(
    dbname=os.getenv("DATABASE_NAME"),
    user=os.getenv("DATABASE_USER"),
    password=os.getenv("DATABASE_PASSWORD"),
    host=os.getenv("DATABASE_HOST"),
    port=os.getenv("DATABASE_PORT"),
)

def salt_and_hash(password):

    return ""

def insert_user(email, phone, user_name, password):

    cur = conn.cursor()

    hashed_pass = salt_and_hash(password)

    access_token = "" # TODO : HOW ARE WE MAKING ACCESS TOKENS?

    query = """INSERT INTO users (email_address) VALUES (%s), (phone_number) VALUES (%s), (name) VALUES (%s), (password) VALUES (%s), (access_token) VALUES (%s);"""

    # Execute the query
    cur.execute(query, (email, phone, user_name, hashed_pass, access_token, ))
    conn.commit()
    cur.close()