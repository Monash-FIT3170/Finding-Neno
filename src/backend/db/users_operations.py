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

def retrieve_user(conn, user_id, token):
    """
    This function is used to retrieve a user for the profile page
    """

    cur = conn.cursor()

    # Check if a user with this email exists in the database
    # Construct a SELECT query to retrieve the user
    query = """SELECT * FROM users WHERE id = %s AND access_token = %s"""

    # Execute the query
    try:
        cur.execute(query, (user_id, token,))
        result_set = cur.fetchall()
        if len(result_set) == 0:  # If a user with the provided email could not be found
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


def insert_missing_report_to_database(connection: psycopg2.extensions.connection, author_id: str, pet_id, last_seen, location_longitude, location_latitude, description):
    """
    This function is used to add a new missing report to the database
    """

    cur = connection.cursor()

    isActive = True

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time, location_longitude, 
    location_latitude, description, isActive) VALUES (%s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        cur.execute(query, (author_id, pet_id, last_seen, location_longitude, location_latitude, description, isActive))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()

def update_missing_report_in_database(connection: psycopg2.extensions.connection, report_id,  pet_id, author_id,
                                      last_seen, location_longitude, location_latitude, description, isActive):
    """
    This function is used to update a missing report in the database
    """

    cur = connection.cursor()

    # UPDATE query to update missing report
    query = """UPDATE missing_reports SET pet_id = %s, author_id = %s, date_time = %s, location_longitude = %s, 
        location_latitude = %s, description = %s, isActive = %s WHERE id = %s;"""

    # Execute the query
    try:
        cur.execute(query, (pet_id, author_id, last_seen, location_longitude, location_latitude, description, isActive, report_id))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()


def archive_missing_report_in_database(connection: psycopg2.extensions.connection, reportId, isActive):
    """
    This function is used to archive a missing report
    """

    cur = connection.cursor()

    # UPDATE query to archive report
    query = """UPDATE missing_reports SET isActive = %s WHERE id = %s;"""

    # Execute the query
    try:
        cur.execute(query, (isActive, reportId))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    connection.commit()
    cur.close()


def retrieve_missing_reports_from_database(connection: psycopg2.extensions.connection, owner_id):
    """
    This function retrieves the missing reports of the logged in user.
    """

    cur = connection.cursor()

    if owner_id == None:
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
                    ORDER BY 
                        mr.date_time DESC;"""

    else:
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
                        u.id = %s
                    ORDER BY 
                        mr.date_time DESC;"""

    try:
        if owner_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (owner_id, ))

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved")

        return missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    cur.close()
    return []

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
                        mr.location_longitude BETWEEN %s AND %s OR mr.location_longitude BETWEEN %s AND %s) AND mr.isactive IS TRUE
                        AND mr.location_latitude BETWEEN %s AND %s
                    ORDER BY 
                        mr.date_time DESC;"""
    
    try:
        if longitude_min_section_two == None and longitude_max_section_two == None:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, latitude_min, latitude_max))
        else:
            cur.execute(query, (longitude_min_section_one, longitude_max_section_one, longitude_min_section_two, longitude_max_section_two, latitude_min, latitude_max))
            
        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports in area successfully retrieved")

        return missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports in area: {e}")

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
        cur.execute(query, (hashed_password, salt, email))

        # Commit the change
        connection.commit()
        print(f"Password successfully changed")
    except Exception as e:
        print(f"Error with changing password: {e}")

    # Close the cursor
    cur.close()
