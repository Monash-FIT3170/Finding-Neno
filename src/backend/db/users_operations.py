import secrets
import string
import hashlib
import psycopg2

from db.authentication import verify_access_token


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


def insert_user_to_database(conn, email, phone, name, password, user_id, access_token):
    """
    This function is used to add a new user to the database
    """
    print('HEHREHRHEHREHRHER')

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

def retrieve_user(conn, user_id, access_token):
    """
    This function is used to retrieve a user for the profile page
    """

    cur = conn.cursor()

    # Check if a user with this email exists in the database
    # Construct a SELECT query to retrieve the user
    query = """SELECT * FROM users WHERE id = %s AND access_token = %s"""

    # Execute the query
    try:
        cur.execute(query, (user_id, access_token,))
        result_set = cur.fetchall()

        # Verify access token
        if not verify_access_token(conn, user_id, access_token):
            return False

        # If a user with the provided email could not be found
        if len(result_set) == 0:
            print("No user found with the provided id and access token.")
            return False
        else:  # If user is found
            user = result_set[0]
            return user[1], user[2], user[3]  # returns user[1] (email), and user[2] (phone) and user[3] (name)

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
            print(user[4])
            
            if user[4] == hashed_pass:  # Check if password and salt matches
                print("User found with the provided email address and matching password.")
                return user[0], user[5]# returns user[0] (user_id), and user[5] (access_token)
            else:
                print("User found with the provided email address, but password does not match.")
                return None
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    conn.commit()
    cur.close()

def insert_new_sighting_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation, missing_report_id, animal, breed, date_time, location_longitude, location_latitude, image_url, description, user_id, access_token):
    """
    This function is used to add a new sighting to the database
    """

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO sightings (missing_report_id, author_id, date_time_of_creation, animal, breed, date_time, location_longitude, 
    location_latitude, image_url, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""

    final_state = False
    # Execute the query
    try:

        # Verify access token
        if not verify_access_token(connection, user_id, access_token):
            return False

        cur.execute(query, (author_id, date_time_of_creation, missing_report_id, animal, breed, date_time, location_longitude, location_latitude, image_url, description))
        print(f"Query executed successfully: {query}")
        final_state = True # set to True only if it executes successfully 
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()
    return final_state

def insert_missing_report_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation, pet_id, last_seen, location_longitude, location_latitude, description, access_token):
    """
    This function is used to add a new missing report to the database
    """

    cur = connection.cursor()

    isActive = True

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time_of_creation, date_time, location_longitude, 
    location_latitude, description, isActive) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:

        # Verify access token
        if not verify_access_token(connection, author_id, access_token):
            return False

        cur.execute(query, (author_id, date_time_of_creation, pet_id, last_seen, location_longitude, location_latitude, description, isActive))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()

def update_missing_report_in_database(connection: psycopg2.extensions.connection, report_id,  pet_id, author_id,
                                      last_seen, location_longitude, location_latitude, description, isActive, access_token):
    """
    This function is used to update a missing report in the database
    """

    cur = connection.cursor()

    # UPDATE query to update missing report
    query = """UPDATE missing_reports SET pet_id = %s, author_id = %s, date_time = %s, location_longitude = %s, 
        location_latitude = %s, description = %s, isActive = %s WHERE id = %s;"""

    # Execute the query
    try:

        # Verify access token
        if not verify_access_token(connection, author_id, access_token):
            return False

        cur.execute(query, (pet_id, author_id, last_seen, location_longitude, location_latitude, description, isActive, report_id))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()


def archive_missing_report_in_database(connection: psycopg2.extensions.connection, reportId, isActive, user_id, access_token):
    """
    This function is used to archive a missing report
    """

    cur = connection.cursor()

    # UPDATE query to archive report
    query = """UPDATE missing_reports SET isActive = %s WHERE id = %s;"""

    # Execute the query
    try:

        # Verify access token
        if not verify_access_token(connection, user_id, access_token):
            return False

        cur.execute(query, (isActive, reportId))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()


def retrieve_missing_reports_from_database(connection: psycopg2.extensions.connection, owner_id):
    """
    This function retrieves all missing reports or missing reports of a user if owner_id is provided.
    Missing report, pet, and owner information are all returned.
    """

    cur = connection.cursor()

    if owner_id == None:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude, 
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    ORDER BY 
                        mr.date_time DESC;
                """

    else:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    WHERE 
                        u.id = %s
                    ORDER BY 
                        mr.date_time DESC;
                """

    try:
        if owner_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (owner_id, ))

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved: {missing_reports}")

        return missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    cur.close()
    return []

def retrieve_sightings_from_database(connection: psycopg2.extensions.connection, missing_report_id: int):
    """
    This function returns all pet sightings or pet sightings for a missing report if missing_report_id is provided.
    """

    # Open cursor to access the connection.
    cur = connection.cursor()

    if missing_report_id == None:
        # Query returns all sightings in the database
        query = """
                    SELECT
                        s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description,
                        u.name, u.email_address, u.phone_number
                    FROM
                        sightings AS s
                    JOIN
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN
                        users AS u ON s.author_id = u.id
                    ORDER BY
                        s.date_time DESC;
                """
    else:
        # Query returns all sightings of a missing report
        query = """
                    SELECT
                        s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description,
                        u.name, u.email_address, u.phone_number
                    FROM
                        sightings AS s
                    JOIN
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN
                        users AS u ON s.author_id = u.id
                    WHERE 
                        s.missing_report_id = %s
                    ORDER BY
                        s.date_time DESC;
                """
        
    try:
        if missing_report_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (missing_report_id, ))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings successfully retrieved")

        return sightings
    except Exception as e:
        print(f"Error with retrieving sightings: {e}")

    cur.close()
    return []

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

        # Verify access token
        if not verify_access_token(connection, user_id, access_token):
            return False

        cur.execute(query, (hashed_password, salt, email))

        # Commit the change
        connection.commit()
        print(f"Password successfully changed")
    except Exception as e:
        print(f"Error with changing password: {e}")

    # Close the cursor
    cur.close()
