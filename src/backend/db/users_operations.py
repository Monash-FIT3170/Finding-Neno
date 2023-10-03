import secrets
import string
import hashlib
import psycopg2
import datetime
import os
import requests # pip install requests==2.31.0 - TODO: add to requirements.txt

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

def insert_user_to_database(connection: psycopg2.extensions.connection, email: str, phone: str, name: str, password: str):
    """
    This function is used to add a new user to the database
    """

    cur = connection.cursor()

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

        # Get the user ID
        query = """SELECT id FROM users WHERE email_address = %s;"""
        cur.execute(query, (email,))
        user_id = cur.fetchone()[0]
        
        # Close the cursor
        connection.commit()
        cur.close()

        # Return the user ID
        return user_id

    except Exception as e:
        print(f"Error while executing query: {e}")
        cur.close()
        return None




def retrieve_user(connection: psycopg2.extensions.connection, profile_user_id: int, user_id: int, access_token: str):
    """
    This function is used to retrieve a user for the profile page.

    Returs
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Check if a user with this email exists in the database
    # Construct a SELECT query to retrieve the user
    query = """SELECT name, email_address, phone_number FROM users WHERE id = %s AND access_token = %s;"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (profile_user_id, access_token,))
        user = cur.fetchall()

        # If a user with the provided email could not be found
        if len(user) == 0:
            print("No user found with the provided id and access token.")
        else:  # If user is found
            result = user[0]  # returns user[1] (email), and user[2] (phone) and user[3] (name)

    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def check_user_exists_in_database(connection: psycopg2.extensions.connection, email: str, password: str):
    """
    This function is used to check if a user exists in the database and if the password match
    """

    cur = connection.cursor()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Check if a user with this email exists in the database
    # Construct a SELECT query to check if the user exists in the database and if its password matches
    query = """SELECT id, access_token FROM users WHERE email_address = %s AND password = %s """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (email, hashed_pass))
        user = cur.fetchall()
        if len(user) == 0:  # If a user with the provided email could not be found
            print("Invalid email or password combination.")
        else: # If login is correct
            result = user[0]
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def insert_sighting_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation: datetime,
                                    missing_report_id: int, animal: str, breed: str, date_time: datetime, location_longitude: float,
                                        location_latitude: float, image_url: str, description: str, user_id: int, access_token: str):
    """
    This function is used to add a new sighting to the database.

    Returns False if access tokenn is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        cur.close()
        return False

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO sightings (missing_report_id, author_id, date_time_of_creation, animal, breed, date_time, location_longitude, 
    location_latitude, image_url, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (author_id, date_time_of_creation, missing_report_id, animal, breed, date_time, location_longitude, location_latitude, image_url, description))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True # set to True only if it executes successfully 
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def insert_missing_report_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation: datetime,
                                      pet_id: int, last_seen: datetime, location_longitude: float, location_latitude: float,
                                          description: str, user_id: int, access_token: str):
    """
    This function is used to add a new missing report to the database.

    Returns the ID of the missing report. If fails, then returns None
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time_of_creation, date_time, location_longitude, 
    location_latitude, description, isActive) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        # New reports are automatically set as active
        isActive = True
        cur.execute(query, (pet_id, author_id, date_time_of_creation, last_seen, location_longitude, location_latitude, description, isActive))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        # Get the missing report ID
        query = """SELECT id FROM missing_reports WHERE pet_id = %s AND author_id = %s AND date_time_of_creation = %s;"""
        cur.execute(query, (pet_id, author_id, date_time_of_creation,))
        missing_report_id = cur.fetchone()[0]
        cur.close()

        return missing_report_id
    except Exception as e:
        print(f"Error while executing query: {e}")
        return None

def insert_user_settings_to_database(connection, user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, possible_sighting_notifications_enabled):
    cur = connection.cursor()

    # Construct an INSERT query to insert this user into the DB
    query = """
    INSERT INTO user_settings
    (user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, possible_sighting_notifications_enabled)
    VALUES (%s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        cur.execute(query, (user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, possible_sighting_notifications_enabled,))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    connection.commit()
    cur.close()

def update_missing_report_in_database(connection: psycopg2.extensions.connection, report_id: int,  pet_id: int, author_id: int,
                                      last_seen, location_longitude, location_latitude, description, isActive, access_token):
    """
    This function is used to update a missing report in the database.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, author_id, access_token):
        return False

    cur = connection.cursor()

    # UPDATE query to update missing report
    query = """
                UPDATE 
                    missing_reports 
                SET 
                    pet_id = %s, author_id = %s, date_time = %s, location_longitude = %s, 
                    location_latitude = %s, description = %s, isActive = %s 
                WHERE 
                    id = %s;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (pet_id, author_id, last_seen, location_longitude, location_latitude, description, isActive, report_id))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def update_report_active_status(connection: psycopg2.extensions.connection, report_id: int, new_status: bool) -> bool:
    try:
        cur = connection.cursor()

        # Update the missing status in the database
        cur.execute("UPDATE missing_reports SET isActive = %s WHERE id = %s;", (new_status, report_id))

        connection.commit()
        cur.close()
        return True
    
    except Exception as e:
        print(f"Error updating status: {e}")
        connection.rollback()
        return False

def update_location_notifications_settings_in_database(connection, user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, access_token):
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # UPDATE query to update missing report
    query = """
                UPDATE 
                    user_settings 
                SET 
                     location_notifications_enabled = %s, location_longitude = %s, location_latitude = %s, location_notification_radius = %s
                WHERE 
                    user_id = %s;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, user_id))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def archive_missing_report_in_database(connection: psycopg2.extensions.connection, reportId, isActive, user_id, access_token):
    """
    This function is used to archive a missing report.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # UPDATE query to archive report
    query = """UPDATE missing_reports SET isActive = %s WHERE id = %s;"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (isActive, reportId))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_missing_reports_from_database(connection: psycopg2.extensions.connection, author_id: int,  user_id: int, access_token: str):
    """
    This function retrieves all missing reports or missing reports of a user if user_id is provided.
    Missing report, pet, and owner information are all returned.

    Returns False if access token is invalid, empty array if no reports exist or an error is encountered, otherwise returns
    missing reports.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    if author_id == None:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude, 
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number,
                        mr.author_id
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    WHERE
                        mr.isActive = true -- Condition to filter out only active missing reports
                    ORDER BY 
                        mr.date_time DESC;
                """

    else:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number,
                        mr.author_id
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    WHERE 
                        u.id = %s AND mr.isActive = true
                    ORDER BY 
                        mr.date_time DESC;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if author_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (author_id, ))

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        result = missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_reports_by_pet_id(connection: psycopg2.extensions.connection, pet_id: int, user_id: int, access_token: str):
    """
    This function retrieves reports based on the provided pet_id.
    Missing report, pet, and owner information are returned.

    Returns False if access token is invalid, an empty array if no reports exist for the given pet_id,
    or an error is encountered. Otherwise, returns the reports.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    query = """
        SELECT 
            mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
            p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
            u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
        FROM 
            missing_reports AS mr
        JOIN 
            pets AS p ON mr.pet_id = p.id
        JOIN 
            users AS u ON mr.author_id = u.id
        WHERE 
            mr.isActive = true -- Condition to filter out only active missing reports
        AND
            p.id = %s;

            
    """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = None

    try:
        cur.execute(query, (pet_id, ))

        # Retrieve the reports
        reports = cur.fetchall()

        if reports:
            print(f"Reports successfully retrieved: {reports}")
            result = reports
        else:
            print(f"No reports found for the provided pet_id")

    except Exception as e:
        print(f"Error with retrieving the reports: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_sightings_from_database(connection: psycopg2.extensions.connection, missing_report_id: int, user_id: int, access_token: str):
    """
    This function returns all pet sightings or pet sightings for a missing report if missing_report_id is provided.

    Returns False if access token is invalid, empty array if no sightings exist or an error is encountered, otherwise returns
    sightings.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Open cursor to access the connection.
    cur = connection.cursor()

    if missing_report_id == None:
        # Query returns all sightings in the database
        query = """
                    SELECT
                        s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, s.breed,
                        u.name, u.email_address, u.phone_number, p.name as pet_name
                    FROM
                        sightings AS s
                    LEFT JOIN
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN 
		                pets AS p ON p.id = mr.pet_id
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
        
    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if missing_report_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (missing_report_id, ))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings successfully retrieved")

        result = sightings
    except Exception as e:
        print(f"Error with retrieving sightings: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_my_report_sightings_from_database(connection: psycopg2.extensions.connection, user_id: int, access_token: str):
    """
    Returns all pet sightingss that are linked to a missing report made/owned by user_id 

    Returns False if access token is invalid, empty array if no sightings exist or an error is encountered, otherwise returns
    sightings.
    """
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Open cursor to access the connection.
    cur = connection.cursor()

    query = """
                SELECT s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, 
                    s.breed, u.name, u.email_address, u.phone_number, p.name as pet_name
                FROM sightings AS s
                    JOIN 
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN 
		                pets AS p ON p.id = mr.pet_id
                    JOIN
                        users AS u ON s.author_id = u.id
                WHERE 
                    mr.author_id = %s
                ORDER BY
                s.date_time DESC;
            """
    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        cur.execute(query, (user_id,))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings for user reports successfully retrieved")

        result = sightings
    except Exception as e:
        print(f"Error with retrieving sightings: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_missing_reports_in_area_from_database(connection: psycopg2.extensions.connection, longitude, longitude_delta, latitude, latitude_delta):
    """
    This function retrieves the missing reports near a coordinate point at latitude longitude. longitude_delta is the width of the area with longitude
    as the centre and latitude_delta is the height of the area with latitude as its centre.
    """
    cur = connection.cursor()
    
    # Area is between -180 and +180 long
    longitude_min_section_one = float(longitude) - float(longitude_delta)/2
    longitude_max_section_one = float(longitude) + float(longitude_delta)/2
    latitude_min = float(latitude) - float(latitude_delta)/2
    latitude_max = float(latitude) + float(latitude_delta)/2

    longitude_min_section_two, longitude_max_section_two = None, None

    # The longitude range of what the map returns is -110 to +250. This calculates if the user's view contains the -110 or +250 boundary.
    if longitude_min_section_one < -110:
        # Area crosses over -110 long i.e. -160 to +160, regions are -160 to -180 and +180 to +160
        longitude_min_section_two = 360 + longitude_min_section_one 
        longitude_max_section_two = 250
        longitude_min_section_one = -110
    elif longitude_max_section_one > 250:
        # Area crosses over +250 long i.e. +230 to -90, regions are +230 to +25 and -110 to -90
        longitude_min_section_two = -110
        longitude_max_section_two = longitude_max_section_one - 360
        longitude_max_section_one = 250

    if longitude_min_section_two == None and longitude_max_section_two == None:
        print("ONE SECTION")
        print(f"{longitude_min_section_one} - {longitude} - {longitude_max_section_one}  d = {longitude_delta}")
        print(f"{latitude_min} - {latitude} - {latitude_max}  d = {latitude_delta}")

        query = """SELECT 
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
                        mr.location_longitude BETWEEN %s AND %s AND mr.location_latitude BETWEEN %s AND %s AND mr.isactive IS TRUE
                    ORDER BY 
                        mr.date_time DESC;"""
    else:
        print("TWO SECTIONS")
        print(f"{longitude_min_section_one} - {longitude} - {longitude_max_section_one}  d = {longitude_delta}")
        print(f"{longitude_min_section_two} - {longitude_max_section_two}  d = {longitude_delta}")
        print(f"{latitude_min} - {latitude} - {latitude_max}  d = {latitude_delta}")

        query = """SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    WHERE (
                        mr.location_longitude BETWEEN %s AND %s OR mr.location_longitude BETWEEN %s AND %s) AND mr.isActive IS TRUE
                        AND mr.location_latitude BETWEEN %s AND %s
                    ORDER BY 
                        mr.date_time DESC;"""
    

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if longitude_min_section_two == None and longitude_max_section_two == None:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, latitude_min, latitude_max))
        else:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, longitude_min_section_two, longitude_max_section_two, latitude_min, latitude_max))
            
        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports in area successfully retrieved")

        result = missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports in area: {e}")

    cur.close()
    return result

def retrieve_sightings_in_area_from_database(connection: psycopg2.extensions.connection, longitude, longitude_delta, latitude, latitude_delta):
    """
    This function retrieves the sightings near a coordinate point at latitude longitude. longitude_delta is the width of the area with longitude
    as the centre and latitude_delta is the height of the area with latitude as its centre.
    """
    cur = connection.cursor()
    
    # Area is between -180 and +180 long
    longitude_min_section_one = float(longitude) - float(longitude_delta)/2
    longitude_max_section_one = float(longitude) + float(longitude_delta)/2
    latitude_min = float(latitude) - float(latitude_delta)/2
    latitude_max = float(latitude) + float(latitude_delta)/2

    longitude_min_section_two, longitude_max_section_two = None, None

    # The longitude range of what the map returns is -110 to +250. This calculates if the user's view contains the -110 or +250 boundary.
    if longitude_min_section_one < -110:
        # Area crosses over -110 long i.e. -160 to +160, regions are -160 to -180 and +180 to +160
        longitude_min_section_two = 360 + longitude_min_section_one 
        longitude_max_section_two = 250
        longitude_min_section_one = -110
    elif longitude_max_section_one > 250:
        # Area crosses over +250 long i.e. +230 to -90, regions are +230 to +25 and -110 to -90
        longitude_min_section_two = -110
        longitude_max_section_two = longitude_max_section_one - 360
        longitude_max_section_one = 250

    if longitude_min_section_two == None and longitude_max_section_two == None:
        print("ONE SECTION SIGHTINGS")
        print(f"{longitude_min_section_one} - {longitude} - {longitude_max_section_one}  d = {longitude_delta}")
        print(f"{latitude_min} - {latitude} - {latitude_max}  d = {latitude_delta}")
        query = """SELECT 
                        s.id AS sightings_id, s.date_time, s.location_longitude, s.location_latitude, s.description, s.animal, s.breed, s.image_url,
                        mr.id AS missing_report_id, mr.date_time, mr.description,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        sightings AS s
                    LEFT JOIN 
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN 
                        users AS u ON s.author_id = u.id
                    WHERE 
                        (s.location_longitude BETWEEN %s AND %s AND s.location_latitude BETWEEN %s AND %s)
                        AND (mr.isActive IS TRUE OR s.missing_report_id IS NULL)
                    ORDER BY 
                        s.date_time DESC;"""
    else:
        print("TWO SECTIONS SIGHTINGS")
        print(f"{longitude_min_section_one} - {longitude} - {longitude_max_section_one}  d = {longitude_delta}")
        print(f"{longitude_min_section_two} - {longitude_max_section_two}  d = {longitude_delta}")
        print(f"{latitude_min} - {latitude} - {latitude_max}  d = {latitude_delta}")

        query = """SELECT 
                        s.id AS sightings_id, s.date_time, s.location_longitude, s.location_latitude, s.description, s.animal, s.breed, s.image_url,
                        mr.id AS missing_report_id, mr.date_time, mr.description,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        sightings AS s
                    LEFT JOIN 
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN 
                        users AS u ON s.author_id = u.id
                    WHERE 
                        (s.location_longitude BETWEEN %s AND %s OR s.location_longitude BETWEEN %s AND %s) AND s.location_latitude BETWEEN %s AND %s
                        AND (mr.isActive IS TRUE OR s.missing_report_id IS NULL)
                        
                    ORDER BY 
                        s.date_time DESC;"""
    

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if longitude_min_section_two == None and longitude_max_section_two == None:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, latitude_min, latitude_max))
        else:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, longitude_min_section_two, longitude_max_section_two, latitude_min, latitude_max))
            
        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings in area successfully retrieved")

        print(f"{len(sightings)} retrieved")

        result = sightings
    except Exception as e:
        print(f"Error with retrieving sightings in area: {e}")

    cur.close()
    return result

def retrieve_location_notification_settings(connection, user_id, access_token):
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    query = """
    SELECT location_notifications_enabled, location_longitude, location_latitude, location_notification_radius
    FROM user_settings WHERE user_id = %s;
    """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (user_id,))
        user_settings = cur.fetchall()

        if len(user_settings) == 0:
            print("No user found with the provided id and access token.")
        else: 
            result = user_settings[0]  

    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def delete_missing_reports_of_pet(connection: psycopg2.extensions.connection, pet_id: int):
    """
    This function deletes all missing reports associated with pet.
    """
    cur = connection.cursor()

    query = """DELETE missing_reports WHERE pet_id = %s;"""

    result = False
    try:
        cur.execute(query, (pet_id, ))

        # Commit the change
        connection.commit()
        print(f"Missing reports successfully deleted")

        result = True
    except Exception as e:
        print(f"Error with changing password: {e}")

    return result

def change_password_in_database(connection: psycopg2.extensions.connection, email: int, new_password: str, user_id: int, access_token: str):
    """
    This function updates the password of the row in the database which matches the email provided.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Open cursor to access the conection.
    cur = connection.cursor()
        
    query = """UPDATE users SET password = %s, salt = %s WHERE email_address = %s;"""

    # Hash and salt password
    hashed_password, salt = salt_and_hash(new_password)

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute query
    try:
        cur.execute(query, (hashed_password, salt, email))

        # Commit the change
        connection.commit()
        print(f"Password successfully changed")

        result = True
    except Exception as e:
        print(f"Error with changing password: {e}")

    # Close the cursor
    cur.close()
    return result

def get_user_details(connection: psycopg2.extensions.connection, user_id: int):
    """
    Retrieves a user from the database using its id.

    Arguments:
        connection: The connection to the database.
        user_id: The id of the user to retrieve.
    Returns: The user if it exists
    """
    cur = connection.cursor()

    query = """
        SELECT 
            id, email_address, phone_number, name
        FROM 
            users
        WHERE 
            id = %s;
    """
    try:
        cur.execute(query, (user_id, ))

        # Retrieve rows as an array
        user = cur.fetchall()

        if user:
            print(f"Missing report successfully retrieved: {user}")
            result = user[0]
        else:
            return None

    except Exception as e:
        print(f"Error with retrieving the missing report: {e}")
        return None

    # Close the cursor
    cur.close()

    user_details = {
        "id": result[0],
        "email_address": result[1],
        "phone_number": result[2],
        "name": result[3],
    }

    return user_details
        
def get_missing_report(connection: psycopg2.extensions.connection, missing_report_id: int):
    """
    Retrieves a missing report from the database using its id.
    
    Arguments:
        connection: The connection to the database.
        missing_report_id: The id of the missing report to retrieve.
    Returns: The missing report if it exists
    """
    cur = connection.cursor()

    query = """
        SELECT 
            id, pet_id, author_id, date_time_of_creation, date_time, location_longitude, location_latitude, description, isactive
        FROM 
            missing_reports
        WHERE 
            id = %s;
    """
    try:
        cur.execute(query, (missing_report_id, ))

        # Retrieve rows as an array
        missing_report = cur.fetchall()

        if missing_report:
            print(f"Missing report successfully retrieved: {missing_report}")
            result = missing_report[0]
        else:
            return None

    except Exception as e:
        print(f"Error with retrieving the missing report: {e}")
        return None

    # Close the cursor
    cur.close()

    mr = {
        "id": result[0],
        "pet_id": result[1],
        "author_id": result[2],
        "date_time_of_creation": result[3],
        "date_time": result[4],
        "location_longitude": result[5],
        "location_latitude": result[6],
        "description": result[7],
        "isactive": result[8],
    }

    return mr


def get_local_users(
    connection: psycopg2.extensions.connection,
    longitude: float,
    latitude: float,
):
    """
    Gets the user IDs of all users who are local to the given coordinates.

    Arguments:
        connection: The connection to the database.
        longitude: The longitude of the user.
        latitude: The latitude of the user.
    """
    cur = connection.cursor()

    # Haversine formula: https://stackoverflow.com/a/57136609
    query = """
    SELECT 
        id
    FROM 
        users JOIN user_settings ON users.id = user_settings.user_id
    WHERE
        acos(
            sin(radians(%s)) * sin(radians(location_latitude)) 
            + cos(radians(%s)) * cos(radians(location_latitude)) * cos(radians(%s) - radians(location_longitude))
        ) * 6371 <= location_notification_radius
    """
    try:
        cur.execute(query, (latitude, latitude, longitude))

        # Retrieve rows as an array
        users = cur.fetchall()

        cur.close()

        if users:
            print(f"Users successfully retrieved: {users}")
            return users
        else:
            return []

    except Exception as e:
        print(f"Error with retrieving the users: {e}")
        cur.close()
        return None



def send_notification(
    email_address: str,
    subject: str,
    content: str,
):
    """
    Sends an email notification using Sendgrid.

    Arguments:
        email_address: The email address to send the notification to.
        subject: The subject of the email notification.
        bcontentdy: The content of the email notification.
    Returns: True if the notification was sent successfully, False otherwise.
    """
    FROM_EMAIL_ADDRESS = "findingnenoofficial@gmail.com"
    URL = "https://api.sendgrid.com/v3/mail/send"
    response = requests.post(
        url=URL,
        headers={
            "Authorization": f"Bearer {os.getenv('SENDGRID_API_KEY')}",
            "Content-Type": "application/json",
        },
        json={
            "personalizations": [
                {
                    "to": [{"email": email_address}],
                    "subject": subject,
                }
            ],
            "content": [
                {
                    "type": "text/html",
                    "value": content,
                }
            ],
            "from": {"email": FROM_EMAIL_ADDRESS, "name": "Finding Neno"},
            "reply_to": {"email": FROM_EMAIL_ADDRESS, "name": "Finding Neno"},
        }
    )
    
    if response.status_code == 202:
        return True
    else:
        print(response.status_code)
        print(response.text)
        return False
