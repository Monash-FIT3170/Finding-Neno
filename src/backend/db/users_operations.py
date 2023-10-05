import secrets
import string
import hashlib
import psycopg2
import datetime

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
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    connection.commit()
    cur.close()

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
    query = """SELECT name, email_address, phone_number FROM users WHERE id = %s AND access_token = %s"""

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


def check_user_exists(connection: psycopg2.extensions.connection, email: str, phoneNumber: str):
    """
    This function is used to check if a user exists with the same email or phone number
    """

    cur = connection.cursor()

    # Check if a user with this email or phone numer exists in the database
    query = """SELECT id, access_token FROM users WHERE (email_address = %s OR phone_number = %s)"""

    result = None

    # Execute the query
    try:
        cur.execute(query, (email, phoneNumber))
        user = cur.fetchall()
        result = (len(user) == 0)
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def check_user_login_details(connection: psycopg2.extensions.connection, username: str, password: str):
    """
    This function is used to check if a user exists in the database and if the password match
    """

    cur = connection.cursor()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Check if a user with this email exists in the database
    # Construct a SELECT query to check if the user exists in the database and if its password matches
    query = """SELECT id, access_token FROM users WHERE (email_address = %s OR phone_number = %s) AND password = %s """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (username, username, hashed_pass))
        user = cur.fetchall()
        if len(user) == 0:  # If a user with the provided email could not be found
            print("Invalid email/phone number or password combination.")
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

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time_of_creation, date_time, location_longitude, 
    location_latitude, description, isActive) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        # New reports are automatically set as active
        isActive = True
        cur.execute(query, (author_id, date_time_of_creation, pet_id, last_seen, location_longitude, location_latitude, description, isActive))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # CClose the cursor
    cur.close()
    return result

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
        result = []

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
        result = []

    # Close the cursor
    cur.close()
    return result

def retrieve_sightings_from_database(connection: psycopg2.extensions.connection, missing_report_id: int, expiry_time, user_id: int, access_token: str):
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

    # Iniltialise list of parameters for query
    params = [user_id]

    # Query returns all sightings in the database
    query = """
                SELECT s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, s.breed,
                        u.name, u.email_address, u.phone_number, ss.user_id as saved_by, p.name as pet_name, mr.isactive
                FROM
                    sightings AS s
                LEFT JOIN
                    missing_reports AS mr ON s.missing_report_id = mr.id
                LEFT JOIN 
                    pets AS p ON p.id = mr.pet_id
                JOIN
                    users AS u ON s.author_id = u.id
                LEFT JOIN 
                    (SELECT * FROM users_saved_sightings WHERE user_id = %s) as ss ON ss.sighting_id = s.id
                WHERE mr.isactive IS NOT FALSE
            """
        
    if missing_report_id != None:
        query += """
                    AND s.missing_report_id = %s
                """
        
        params.append(missing_report_id)
    
    if expiry_time != None:
        query += """
                    AND s.date_time_of_creation > CURRENT_DATE - %s
                """
        params.append(int(expiry_time))
            
    query += """
                ORDER BY
                s.date_time DESC;
            """
    result = False

    try:
        cur.execute(query, params)

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings successfully retrieved")

        if sightings is not None:
            result = sightings
        else:
            result = []
    except Exception as e:
        print(f"Error with retrieving sightings: {e}")
        result = []

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
        print("problem with access token")
        return False

    # Open cursor to access the connection.
    cur = connection.cursor()

    query = """
                SELECT s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, s.breed, u.name, u.email_address, u.phone_number, ss.user_id as saved_by, p.name as pet_name, mr.isactive
                FROM sightings AS s
                    JOIN 
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN 
		                pets AS p ON p.id = mr.pet_id
                    JOIN
                        users AS u ON s.author_id = u.id
                    LEFT JOIN 
                    	(SELECT * FROM users_saved_sightings WHERE user_id = %s) as ss ON ss.sighting_id = s.id
                WHERE 
                    mr.author_id = %s AND mr.isactive IS NOT FALSE
                ORDER BY
                s.date_time DESC;
            """
    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        cur.execute(query, (user_id, user_id))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings for user reports successfully retrieved")

        if sightings is not None:
            result = sightings
        else:
            result = []

    except Exception as e:
        print(f"Error with retrieving sightings: {e}")
        result = []

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

        if missing_reports is not None:
            result = missing_reports
        else:
            result = []
    except Exception as e:
        print(f"Error with retrieving missing reports in area: {e}")
        result = []

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

        if sightings is not None:
            result = sightings
        else:
            result = []
    except Exception as e:
        print(f"Error with retrieving sightings in area: {e}")
        result = []

    cur.close()
    return result

def retrieve_user_saved_sightings(connection: psycopg2.extensions.connection, user_id: int, access_token: str ):
    """
    This function retrieves the sightings a user has saved
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # same as retrieve_sightings_from_database but also has filter for saved_by
    query = """
        SELECT s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, s.breed, u.name, u.email_address, u.phone_number, ss.user_id as saved_by, p.name as pet_name, mr.isactive
        FROM
            sightings AS s
        LEFT JOIN
            missing_reports AS mr ON s.missing_report_id = mr.id
        LEFT JOIN 
            pets AS p ON p.id = mr.pet_id
        JOIN
            users AS u ON s.author_id = u.id
        LEFT JOIN 
            users_saved_sightings AS ss ON ss.sighting_id = s.id
        WHERE ss.user_id = %s AND mr.isactive IS NOT FALSE
        ORDER BY
            s.date_time DESC;   
    """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (user_id,))
        sightings = cur.fetchall()

        result = sightings

        print(f"User saved sightings successfully retrieved")

        print(f"{len(sightings)} retrieved")

    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result


def save_sighting_for_user(connection: psycopg2.extensions.connection, user_id: int, access_token: str, sighting_id: int):
    """
    This function records a user saving a sighting
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO users_saved_sightings (user_id, sighting_id) VALUES (%s, %s);"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (user_id, sighting_id))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True  # set to True only if it executes successfully
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def unsave_sighting_for_user(connection: psycopg2.extensions.connection, user_id: int, access_token: str, sighting_id: int):
    """
    This function records a user unsaving a sighting
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """DELETE FROM users_saved_sightings WHERE user_id = %s AND sighting_id = %s;"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (user_id, sighting_id))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True  # set to True only if it executes successfully
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

def delete_all_user_data_from_database(connection: psycopg2.extensions.connection, to_delete_id: int, user_id: int, access_token: str):
    """
    This function deletes the user with the provided id from the database. It first deletes all sightings the user created, unlinks any sightings made
    by other users on this user's missing reports, and then deletes the user's missing reports before deleting the user's pets. 
    Finally, it deletes the user from the database.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Delete user's sightings
    if not delete_all_user_sightings(connection=connection, user_id=to_delete_id):
        return False

    # Unlink sightings made by other users on this user's missing reports
    if not unlink_sightings_from_user_missing_reports(connection=connection, user_id=user_id):
        return False

    # Delete user's missing reports
    if not delete_all_user_missing_reports(connection=connection, user_id=to_delete_id):
        return False

    # Delete user's pets
    if not delete_all_user_pets(connection=connection, user_id=to_delete_id):
        return False
    
    # Delete user
    if not delete_user(connection=connection, user_id=to_delete_id):
        return False

    return True

def delete_all_user_sightings(connection: psycopg2.extensions.connection, user_id: int):

    cur = connection.cursor()

    query = """
        DELETE FROM sightings WHERE author_id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"Sightings successfully deleted")

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()

def unlink_sightings_from_user_missing_reports(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function unlinks sightings made by other users on this user's missing reports.
    """

    cur = connection.cursor()

    query = """
        UPDATE sightings SET missing_report_id = NULL WHERE missing_report_id IN (SELECT id FROM missing_reports WHERE author_id = %s);
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"Sightings successfully unlinked")

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()

def delete_all_user_missing_reports(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function deletes all missing reports created by the user.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM missing_reports WHERE author_id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"Missing reports successfully deleted")

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()

def delete_all_user_pets(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function deletes all pets owned by the user.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM pets WHERE owner_id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"Pets successfully deleted")

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()

def delete_user(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function deletes the user with the provided id from the database.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM users WHERE id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"User successfully deleted")

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()