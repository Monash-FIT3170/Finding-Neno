import psycopg2
import os
from dotenv import load_dotenv

def setup_database(connection: psycopg2.extensions.connection):
    """
    Sets up the database, including tables, keys and foreign key constraints
    """
    cur = connection.cursor()

    # Create user table

    # Create user settings table

    # Create pet table

    # Create missing_report table

    # Create sighting table

    # Create notification_log table

    # Create user_notification table

    cur.close()


def delete_tables(connection: psycopg2.extensions.connection):
    """
    Deletes all the tables in the database
    """
    cur = connection.cursor()

    # Delete user_notification table

    # Delete notification_log table

    # Delete sighting table

    # Delete missing_report table

    # Delete pet table

    # Delete user_settings table

    # Delete user table

    cur.close()

    
if __name__ == "__main__":
    load_dotenv(os.path.dirname(__file__), '../../..', '.env')

    # Connect to your postgres DB
    conn = psycopg2.connect(
        dbname=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT"),
    )
    
    # setup_database(connection=conn)