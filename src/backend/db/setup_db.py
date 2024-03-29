#!/usr/bin/python3

import psycopg2
import os
from dotenv import load_dotenv
import sys

"""
This script sets up the database, including tables, keys and foreign key constraints

Prerequisite: you must have a .env file in the root directory of the project with the following environment variables:
    DATABASE_NAME
    DATABASE_USER
    DATABASE_PASSWORD
    DATABASE_HOST
    DATABASE_PORT

Example .env file:
    DATABASE_NAME=postgres
    DATABASE_USER=postgres
    DATABASE_PASSWORD=password
    DATABASE_HOST=localhost
    DATABASE_PORT=5432

This .env file should not be committed to the repository, as it contains your database credentials,
and additionally everyone has their local database set up slightly differently.

To run this script, run the following command from the root directory:
    python src/backend/db/setup_db.py .env
"""

def create_tables(connection: psycopg2.extensions.connection):
    """
    Sets up the database, including tables, keys and foreign key constraints
    """
    cur = connection.cursor()

    queries = [
        # Create users table
        """CREATE TABLE "users" (id SERIAL PRIMARY KEY, email_address VARCHAR(255) UNIQUE NOT NULL, phone_number VARCHAR(
        255), name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, salt VARCHAR(255), access_token VARCHAR(255) NOT NULL);""",
        # Create user settings table
        """CREATE TABLE "user_settings" (user_id INTEGER PRIMARY KEY REFERENCES "users"(id), location_notifications_enabled BOOLEAN NOT NULL, location_longitude FLOAT, location_latitude FLOAT, location_notification_radius FLOAT, possible_sighting_notifications_enabled BOOLEAN NOT NULL);""",
        # Create pets table
        """CREATE TABLE "pets" (id SERIAL PRIMARY KEY, name VARCHAR(255), animal VARCHAR(255), breed VARCHAR(255), 
        description VARCHAR(255), image_url VARCHAR(1000), isMissing BOOLEAN DEFAULT FALSE,  owner_id INTEGER REFERENCES "users"(id));""",
        # Create missing_reports table
        """CREATE TABLE "missing_reports" (id SERIAL PRIMARY KEY, pet_id INTEGER REFERENCES pets(id), author_id 
        INTEGER REFERENCES "users"(id), date_time_of_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, date_time TIMESTAMP NOT NULL, location_longitude FLOAT, location_latitude 
        FLOAT, location_string VARCHAR(255), description VARCHAR(255), is_active BOOLEAN DEFAULT TRUE);""",
        # Create sightings table
        """CREATE TABLE "sightings" (id SERIAL PRIMARY KEY, missing_report_id INTEGER REFERENCES missing_reports(id), 
        author_id INTEGER REFERENCES "users"(id), date_time_of_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, animal VARCHAR(255), breed VARCHAR(255), date_time TIMESTAMP NOT NULL, location_longitude FLOAT, 
        location_latitude FLOAT, location_string VARCHAR(255), image_url VARCHAR(255), description VARCHAR(255));""",
        # Create users_saved_sightings
        """CREATE TABLE "users_saved_sightings" (saved_id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES "users"(id),
        sighting_id INTEGER REFERENCES "sightings"(id));""",
    ]

    for query in queries:
        try:
            cur.execute(query)
            print(f"Query executed successfully: {query}")
        except Exception as e:
            print(f"Error while executing query: {e}")

    connection.commit()
    cur.close()


def drop_tables(connection: psycopg2.extensions.connection):
    """
    Drops all the tables in the database (if they exist)
    """
    cur = connection.cursor()

    queries = [
        # Drop users_saved_sightings table
        """DROP TABLE IF EXISTS users_saved_sightings CASCADE;""",
        # Drop sightings table
        """DROP TABLE IF EXISTS sightings CASCADE;""",
        # Drop missing_reports table
        """DROP TABLE IF EXISTS missing_reports CASCADE;""",
        # Drop pets table
        """DROP TABLE IF EXISTS pets CASCADE;""",
        # Drop user_settings table
        """DROP TABLE IF EXISTS user_settings CASCADE;""",
        # Drop users table
        """DROP TABLE IF EXISTS users CASCADE;""",
    ]

    for query in queries:
        try:
            cur.execute(query)
            print(f"Query executed successfully: {query}")
        except Exception as e:
            print(f"Error while executing query: {e}")

    connection.commit()
    cur.close()


if __name__ == "__main__":
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

        # Drop tables if they exist
        drop_tables(connection=conn)

        # Create/recreate tables
        create_tables(connection=conn)

        # Close connection
        conn.close()
