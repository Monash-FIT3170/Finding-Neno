import secrets
import string
import hashlib
import psycopg2


def get_salt(password):
    # Convert the password to bytes
    password_bytes = password.encode()

    # Use SHA256 to generate the salt
    salt = hashlib.sha256(password_bytes).hexdigest()

    return salt

def salt_and_hash(password):
    """
    This function is responsible to salt and hash the password it receives
    :Input:
    argv1: password(string)
    :return: hashed password(string)
    """


    salt = get_salt(password)
    salted_password = f"{password}{salt}"
    hasher = hashlib.sha256()
    hasher.update(salted_password.encode('utf-8'))
    hashed_password = hasher.hexdigest()

    return hashed_password


def generate_access_token():
    """
    This function generates an 32 character random access token using both letters and numbers
    :return: access token(string)
    """

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))

    return token


def insert_user_to_database(conn, email, phone, name, password):
    """
    This function is used to add a new user to the database
    """

    cur = conn.cursor()

    # Generate an access token
    access_token = generate_access_token()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Construct an INSERT query to insert this user into the DB
    query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        cur.execute(query, (email, phone, name, hashed_pass, access_token))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    conn.commit()
    cur.close()


def check_user_exists_in_database(conn, email, password):
    """
    This function is used to check if a user exists in the database and if the password match
    """

    cur = conn.cursor()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Check if a user with this email exists in the database
    # Construct a SELECT query to check if the user exists in the database
    query = """SELECT * FROM users WHERE email_address = %s"""

    # Execute the query
    try:
        cur.execute(query, (email,))
        result_set = cur.fetchall()
        if len(result_set) == 0:  # If a user with the provided email could not be found
            print("No user found with the provided email address.")
            return False
        else: # If user is found
            user = result_set[0]
            if user[4] == hashed_pass:  # Check if password and salt matches
                print("User found with the provided email address and matching password.")
                return True
            else:
                print("User found with the provided email address, but password does not match.")
                return False
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    conn.commit()
    cur.close()


def insert_missing_report_to_database(connection: psycopg2.extensions.connection, author_id, pet_id, last_seen, location_longitude, location_latitude, description):
    """
    This function is used to add a new missing report to the database
    """

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time, location_longitude, 
    location_latitude, description, status) VALUES (%s, %s, %s, %s, %s, %s, FALSE);"""

    # Execute the query
    try:
        cur.execute(query, (author_id, pet_id, last_seen, location_longitude, location_latitude, description))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()

def retrieve_all_missing_reports_from_database(connection: psycopg2.extensions.connection):
    """
    This function retrieves all missing reports from the database.
    """

    cur = connection.cursor()

    query = """SELECT * FROM missing_reports;"""

    try:
        cur.execute(query)

        # Retrieve rows as an array
        all_missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        return all_missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    cur.close()
    return None

def retrieve_missing_reports_of_user_from_database(connection: psycopg2.extensions.connection, author_id):
    """
    This function retrieves the missing reports of the logged in user.
    """

    cur = connection.cursor()

    query = """SELECT * FROM missing_reports WHERE author_id = %s;"""

    try:
        cur.execute(query, (author_id, ))

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        return missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    cur.close()
    return None


def change_password_in_database(connection: psycopg2.extensions.connection, email: int, new_password: str):
    """
    This function updates the password of the row in the database which matches the email provided.
    """

    # Open cursor to access the conection.
    cur = connection.cursor()
        
    query = """UPDATE users SET password = %s, salt = %s WHERE email_address = %s;"""

    # Hash and salt password
    hashed_password, salt = salt_and_hash(new_password)

    # Execute query
    try:
        cur.execute(query, (hashed_password, salt, email))

        # Commit the change
        connection.commit()
        print(f"Password successfully changed")
    except Exception as e:
        print(f"Error with changing password: {e}")

    # Close the cursor
    cur.close()
