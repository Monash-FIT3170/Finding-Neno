import unittest
from unittest.mock import MagicMock, patch
import string
import hashlib
import secrets
from users_operations import get_salt, salt_and_hash, generate_access_token, insert_user_to_database, check_user_login_details  # replace 'your_module' with the name of your module

class TestDatabaseFunctions(unittest.TestCase):

    def test_get_salt(self):
        password = 'password'
        salt = get_salt(password)
        expected_salt = hashlib.sha256(password.encode()).hexdigest()
        self.assertEqual(salt, expected_salt)

    def test_salt_and_hash(self):
        password = 'password'
        hashed_password = salt_and_hash(password)
        salt = get_salt(password)
        salted_password = f"{password}{salt}"
        hasher = hashlib.sha256()
        hasher.update(salted_password.encode('utf-8'))
        expected_hashed_password = hasher.hexdigest()
        self.assertEqual(hashed_password, expected_hashed_password)

    def test_generate_access_token(self):
        token = generate_access_token()
        self.assertEqual(len(token), 32)
        for character in token:
            self.assertIn(character, string.ascii_letters + string.digits)

    @patch('users_operations.generate_access_token')
    @patch('users_operations.salt_and_hash')
    def test_insert_user_to_database(self, mock_salt_and_hash, mock_generate_access_token):
        # Set up the mock objects
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_salt_and_hash.return_value = 'hashed_password'
        mock_generate_access_token.return_value = 'access_token'

        # Call the function with the mock objects
        insert_user_to_database(mock_conn, 'test@example.com', '1234567890', 'Test User', 'password')

        # Check that the cursor's execute method was called with the right parameters
        query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, %s,\n    %s);"""

        mock_cursor.execute.assert_called_once_with(query, ('test@example.com', '1234567890', 'Test User', 'hashed_password', 'access_token'))

        # Check that the connection's commit method was called
        mock_conn.commit.assert_called_once()

        # Check that the cursor's close method was called
        mock_cursor.close.assert_called_once()

    @patch('users_operations.salt_and_hash')
    def test_check_user_exists_in_database(self, mock_salt_and_hash):
        # Set up the mock objects
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        hashed_password = 'hashed_password'  # Define hashed password
        mock_salt_and_hash.side_effect = lambda x: 'hashed_password' if x == 'password' else x
        mock_cursor.fetchall.return_value = [
            ('test@example.com', '1234567890', 'Test User', hashed_password, 'access_token')]

        # Call the function with the mock objects
        result = check_user_login_details(mock_conn, 'test@example.com', 'password')  # use 'password' here

        # Check that the cursor's execute method was called with the right parameters
        query = """SELECT * FROM users WHERE email_address = %s;"""
        mock_cursor.execute.assert_called_once_with(query, 'test@example.com')  # Expect a tuple instead of a string

        # Check that the result is True
        self.assertEqual(result, True)


if __name__ == '__main__':
    unittest.main()
