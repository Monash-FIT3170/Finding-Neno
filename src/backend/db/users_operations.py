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
    location_latitude, description, is_active) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        # New reports are automatically set as active
        is_active = True
        cur.execute(query, (author_id, date_time_of_creation, pet_id, last_seen, location_longitude, location_latitude, description, is_active))
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
                                      last_seen, location_longitude, location_latitude, description, is_active, access_token):
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
                    location_latitude = %s, description = %s, is_active = %s 
                WHERE 
                    id = %s;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (pet_id, author_id, last_seen, location_longitude, location_latitude, description, is_active, report_id))
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
        cur.execute("UPDATE missing_reports SET is_active = %s WHERE id = %s;", (new_status, report_id))

        connection.commit()
        cur.close()
        return True
    
    except Exception as e:
        print(f"Error updating status: {e}")
        connection.rollback()
        return False


def archive_missing_report_in_database(connection: psycopg2.extensions.connection, reportId, is_active, user_id, access_token):
    """
    This function is used to archive a missing report.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # UPDATE query to archive report
    query = """UPDATE missing_reports SET is_active = %s WHERE id = %s;"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (is_active, reportId))
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
                        mr.is_active = true -- Condition to filter out only active missing reports
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
                        u.id = %s AND mr.is_active = true
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

def filter_missing_reports_from_database(connection: psycopg2.extensions.connection, filters, user_id: int, access_token: str):
    """
    This function retrieves filtered list of missing reports by pet type, pet breed, proximity to a location.
    Missing report, pet, and owner information are all returned.

    Returns False if access token is invalid, empty array if no reports exist or an error is encountered, otherwise returns
    missing reports.
    """
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False
    

    
    # Start building the query
    query = """
                SELECT * 
                FROM (
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number,
                        mr.author_id
            """

    # Initialise parameters
    params = []

    # Add extra columns if location filters are provided to enable sorting by distance     
    if filters.get("location_radius"):     
        query += """                    
                    , ST_Distance(
                            ST_GeogFromText('Point(%s %s)'),
                            ST_GeogFromText(CONCAT('Point(', mr.location_longitude,' ', mr.location_latitude, ')'))
                        ) / 1000 AS distance
                """
        params.extend([filters["location_longitude"], filters["location_latitude"]])
        
    # Continue building query
    query += """
                FROM 
                    missing_reports AS mr
                JOIN 
                    pets AS p ON mr.pet_id = p.id
                JOIN 
                    users AS u ON mr.author_id = u.id
                WHERE
                    mr.is_active = %s
            """
    

    if filters.get("is_active"):
        params.append(filters.get("is_active"))
    else:
        params.append(True)
    
    if filters.get("author_id"):
        query += "AND mr.author_id = %s "
        params.append(filters["author_id"])

    # Check if pet_breed is provided
    if filters.get("pet_breed"):
        # query += "AND p.animal IN %s "
        # params.append(tuple(filters["pet_animal"]))

        # Create a list of filter conditions for each substring
        breed_conditions = []
        for breed in filters["pet_breed"]:
            breed_conditions.append("p.breed ILIKE %s")
            params.append(f"%{breed}%")

        # Combine the conditions with OR
        breed_condition_query = " OR ".join(breed_conditions)
        
        # Add combined condition to the query
        query += f"AND ({breed_condition_query}) "

    # Check if pet_type is provided
    if filters.get("pet_type"):
        query += "AND p.animal IN %s "
        params.append(tuple(filters["pet_type"]))

    # Close subquery
    query += ") AS filtered_reports "

    # Check if location filters are provided
    if filters.get("location_radius"):
        query += """
                    WHERE 
                        distance <= %s
                """
        params.append(filters["location_radius"])

    # Set temporal sorting setting
    if filters.get("sort_order") == "ASC":
        query += "ORDER BY date_time ASC "
    else:
        query += "ORDER BY date_time DESC "

    # Sort by closest to furthest
    if filters.get("location_radius"):
        query += ", distance ASC;"

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False
    cur = connection.cursor()

    try:
        # if author_id == None:
        # cur.execute(query)
        # else:
        cur.execute(query, params)

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        if missing_reports is not None:
            result = missing_reports
        else:
            result = []
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    # Close the cursor
    cur.close()
    return result

def filter_sightings_from_database(connection: psycopg2.extensions.connection, filters, user_id: int, access_token: str):
    """
    This function retrieves filtered list of sightings by pet type, pet breed, proximity to a location.
    Missing report, pet, and owner information are all returned.

    Returns False if access token is invalid, empty array if no sightings exist or an error is encountered, otherwise returns
    sightings.
    """
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False
        
    
    # Start building the query
    query = """
                SELECT *
                FROM (
                    SELECT
                        s.id AS sighting_id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description,
                        u.id AS author_id, u.name AS author_name, u.email_address AS author_email, u.phone_number AS author_phone_number
            """
        
    # Initialise parameters
    params = []

    # Add extra columns if location filters are provided to enable sorting by distance     
    if filters.get("location_radius"):     
        query += """                    
                    , ST_Distance(
                            ST_GeogFromText('Point(%s %s)'),
                            ST_GeogFromText(CONCAT('Point(', s.location_longitude,' ', s.location_latitude, ')'))
                        ) / 1000 AS distance
                """
        params.extend([filters["location_longitude"], filters["location_latitude"]])         
                    
    # Continue building query
    query += """ 
                FROM 
                    sightings AS s
                JOIN 
                    missing_reports AS mr ON s.missing_report_id = mr.id
                JOIN 
                    users AS u ON s.author_id = u.id
                WHERE
                    s.is_active = %s
            """
    

    if filters.get("is_active"):
        params.append(filters.get("is_active"))
    else:
        params.append(True)
    
    if filters.get("author_id"):
        query += "AND s.author_id = %s "
        params.append(filters["author_id"])

    # Check if pet_breed is provided
    if filters.get("pet_breed"):
        # query += "AND p.animal IN %s "
        # params.append(tuple(filters["pet_animal"]))

        # Create a list of filter conditions for each substring
        breed_conditions = []
        for breed in filters["pet_breed"]:
            breed_conditions.append("s.breed ILIKE %s")
            params.append(f"%{breed}%")

        # Combine the conditions with OR
        breed_condition_query = " OR ".join(breed_conditions)
        
        # Add combined condition to the query
        query += f"AND ({breed_condition_query}) "

    # Check if pet_type is provided
    if filters.get("pet_type"):
        query += "AND s.animal IN %s "
        params.append(tuple(filters["pet_type"]))

    # Check if location filters are provided
    if filters.get("location_longitude") and filters.get("location_latitude"):
        query += """
            AND ST_Distance(
                    ST_Point(%s, %s),
                    ST_Point(mr.location_longitude, mr.location_latitude)
                ) <= %s

        """
        params.extend([filters["location_longitude"], filters["location_latitude"], filters["location_radius"]])

    # Finish building the query
    if filters.get("sort_order") == "ASC":
        query += "ORDER BY mr.date_time ASC; "
    else:
        query += "ORDER BY mr.date_time DESC; "

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    cur = connection.cursor()

    try:
        # if author_id == None:
        # cur.execute(query)
        # else:
        cur.execute(query, params)

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        if missing_reports is not None:
            result = missing_reports
        else:
            result = []
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
            mr.is_active = true -- Condition to filter out only active missing reports
        AND
            p.id = %s;

            
    """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        cur.execute(query, (pet_id, ))

        # Retrieve the reports
        reports = cur.fetchall()

        if reports is not None:
            print(f"Reports successfully retrieved: {reports}")
            result = reports
        else:
            print(f"No reports found for the provided pet_id")
            result = []

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

    # if missing_report_id == None:
    #     # Query returns all sightings in the database
    #     query = """
    #                 SELECT
    #                     s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description, s.animal, s.breed,
    #                     u.name, u.email_address, u.phone_number
    #                 FROM
    #                     sightings AS s
    #                 LEFT JOIN
    #                     missing_reports AS mr ON s.missing_report_id = mr.id
    #                 JOIN
    #                     users AS u ON s.author_id = u.id
    #                 ORDER BY
    #                     s.date_time DESC;
    #             """
    # else:
    #     # Query returns all sightings of a missing report
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
        # if missing_report_id == None:
        #     cur.execute(query)
        # else:
        cur.execute(query, (missing_report_id, ))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings successfully retrieved")

        if sightings is not None:
            result = sightings
        else:
            result = []
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
    # Calculate longitude boundaries
    longitude_min = float(longitude) - float(longitude_delta)/2
    longitude_max = float(longitude) + float(longitude_delta)/2
    # Calculate latitude boundaries
    latitude_min = float(latitude) - float(latitude_delta)/2
    latitude_max = float(latitude) + float(latitude_delta)/2

    longitude_min_section_two, longitude_max_section_two = None, None

    # Re-adjusting boundaries. 
    # The longitude range of what the map returns is -110 to +250. This calculates if the user's view contains the -110 or +250 boundary.
    if longitude_min < -110:
        # Area crosses over -110 long i.e. -160 to +160, regions are -160 to -180 and +180 to +160
        longitude_min_section_two = 360 + longitude_min 
        longitude_max_section_two = 250
        longitude_min = -110
    elif longitude_max > 250:
        # Area crosses over +250 long i.e. +230 to -90, regions are +230 to +25 and -110 to -90
        longitude_min_section_two = -110
        longitude_max_section_two = longitude_max - 360
        longitude_max = 250

    if longitude_min_section_two == None and longitude_max_section_two == None:
        print("ONE SECTION")
        print(f"{longitude_min} - {longitude} - {longitude_max}  d = {longitude_delta}")
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
                        mr.location_longitude BETWEEN %s AND %s AND mr.location_latitude BETWEEN %s AND %s AND mr.is_active IS TRUE
                    ORDER BY 
                        mr.date_time DESC;"""
    else:
        print("TWO SECTIONS")
        print(f"{longitude_min} - {longitude} - {longitude_max}  d = {longitude_delta}")
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
                    WHERE 
                        (mr.location_longitude BETWEEN %s AND %s OR mr.location_longitude BETWEEN %s AND %s) AND
                        mr.location_latitude BETWEEN %s AND %s AND mr.is_active IS TRUE
                    ORDER BY 
                        mr.date_time DESC;"""
    

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if longitude_min_section_two is None:
            cur.execute(query, (longitude_min, longitude_max, latitude_min, latitude_max))
        else:
            cur.execute(query, (longitude_min, longitude_max, longitude_min_section_two, longitude_max_section_two, latitude_min, latitude_max))
            
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
    # Calculate longitude boundaries
    longitude_min = float(longitude) - float(longitude_delta)/2
    longitude_max = float(longitude) + float(longitude_delta)/2
    # Calculate latitude boundaries
    latitude_min = float(latitude) - float(latitude_delta)/2
    latitude_max = float(latitude) + float(latitude_delta)/2

    longitude_min_section_two, longitude_max_section_two = None, None

    # Re-adjusting boundaries. 
    # The longitude range of what the map returns is -110 to +250. This calculates if the user's view contains the -110 or +250 boundary.
    if longitude_min < -110:
        # Area crosses over -110 long i.e. -160 to +160, regions are -160 to -180 and +180 to +160
        longitude_min_section_two = 360 + longitude_min 
        longitude_max_section_two = 250
        longitude_min = -110
    elif longitude_max > 250:
        # Area crosses over +250 long i.e. +230 to -90, regions are +230 to +25 and -110 to -90
        longitude_min_section_two = -110
        longitude_max_section_two = longitude_max - 360
        longitude_max = 250

    if longitude_min_section_two == None and longitude_max_section_two == None:
        print("ONE SECTION SIGHTINGS")
        print(f"{longitude_min} - {longitude} - {longitude_max}  d = {longitude_delta}")
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
                        AND (mr.is_active IS TRUE OR s.missing_report_id IS NULL)
                    ORDER BY 
                        s.date_time DESC;"""
    else:
        print("TWO SECTIONS SIGHTINGS")
        print(f"{longitude_min} - {longitude} - {longitude_max}  d = {longitude_delta}")
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
                        AND (mr.is_active IS TRUE OR s.missing_report_id IS NULL)
                        
                    ORDER BY 
                        s.date_time DESC;"""
    

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if longitude_min_section_two == None and longitude_max_section_two == None:
            cur.execute(query, (longitude_min, longitude_max, latitude_min, latitude_max))
        else:
            cur.execute(query, (longitude_min, longitude_max, longitude_min_section_two, longitude_max_section_two, latitude_min, latitude_max))
            
        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings in area successfully retrieved")

        print(f"{len(sightings)} retrieved")

        result = sightings
    except Exception as e:
        print(f"Error with retrieving sightings in area: {e}")

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