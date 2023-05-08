import subprocess
import pytest

from db.users_operations import insert_user_to_database, check_user_exists_in_database

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
def setup_db_for_local():
    try:
        conn = get_connection()
        run_script(setup_db_path)
        insert_basic_users(conn)
    except Exception as e:
        print(f"Failed to set up test database: {e}")


def test_finding_user():

    conn = get_connection()

    assert check_user_exists_in_database(conn, "jonathanbanks@example.com", "password1") is True  # Email and pass match
    assert check_user_exists_in_database(conn, "jonathanbanks@example.com", "password2") is False  # Email match, pass doesn't
    assert check_user_exists_in_database(conn, "cenajohn@example.com", "password2") is False  # Email doesn't match


# TODO: Something I stole from chatgpt, please remove if using something else
# import pytest
# from unittest.mock import MagicMock
# from your_flask_app import app
#
# @pytest.fixture
# def client():
#     app.testing = True
#     with app.test_client() as client:
#         yield client
#
# def test_insert_user(client):
#     # Set up the mock psycopg2 connection and cursor objects
#     connection_mock = MagicMock()
#     cursor_mock = MagicMock()
#     connection_mock.cursor.return_value.__enter__.return_value = cursor_mock
#     connection_mock.getconn.return_value = connection_mock
#
#     # Replace the get_connection function with the mock connection
#     from your_flask_app import get_connection
#     get_connection = MagicMock(return_value=connection_mock)
#
#     # Make a request to the API endpoint
#     response = client.post('/insert_user', data={'username': 'test_user', 'password': 'password123'})
#
#     # Assert that the API call was successful
#     assert response.status_code == 200
#     assert response.data == b'Success'
#
#     # Assert that the insert_user function was called with the correct arguments
#     from your_flask_app.api.user_service import insert_user
#     insert_user.assert_called_once_with(cursor_mock, 'test_user', 'password123')
#
