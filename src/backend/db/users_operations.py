import psycopg2
import os
from dotenv import load_dotenv
import sys


def salt_and_hash(password):

    return ""

def insert_user(conn, email, phone, user_name, password):

    cur = conn.cursor()

    hashed_pass = salt_and_hash(password)

    access_token = "" # TODO : HOW ARE WE MAKING ACCESS TOKENS?

    query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, %s);"""

    # Execute the query
    cur.execute(query, (email, phone, user_name, password, access_token))
    conn.commit()
    cur.close()