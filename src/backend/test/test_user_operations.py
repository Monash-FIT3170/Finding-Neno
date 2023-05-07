import subprocess
import pytest

from db.users_operations import insert_user_to_database, check_user_exists_in_database
from api.main import create_database_pool

setup_db_path = "../db/setup_db.py"


def run_script(script_path):
    try:
        result = subprocess.run(['python', script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0:
            print("Script executed successfully.")
            print(result.stdout.decode())
        else:
            print("Script execution failed.")
            print(result.stderr.decode())
    except Exception as e:
        print(f"Error while running script: {e}")


def insert_basic_users(conn):
    insert_user_to_database(conn, "jonathanbanks@example.com", "+1234567890", "Jonathan Banks", "password1")
    insert_user_to_database(conn, "lesfos@example.com", "+0987654321", "Leslie Foster", "password2")
    insert_user_to_database(conn, "solidsnake@example.com", "+2314657980", "Snakus Solidus", "password3")


@pytest.fixture(autouse=True)
def setup_db_for_local(conn):
    try:
        run_script(setup_db_path)
        insert_basic_users(conn)
    except Exception as e:
        print(f"Failed to set up test database: {e}")


def test_finding_user():

    conn = create_database_pool()

    assert check_user_exists_in_database(conn, "jonathanbanks@example.com", "password1") is True  # Email and pass match
    assert check_user_exists_in_database(conn, "jonathanbanks@example.com", "password2") is False  # Email match, pass doesn't
    assert check_user_exists_in_database(conn, "cenajohn@example.com", "password2") is False  # Email doesn't match

