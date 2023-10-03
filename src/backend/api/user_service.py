import flask
from flask import request, jsonify
from pathlib import Path
import sys
import datetime
from typing import Tuple, Dict, Any

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.authentication import verify_access_token
from db.users_operations import *
from db.pets import get_pet
from api.notification_bodies import generate_email_body_sighting

def check_access_token(connection) -> bool:
    # json_data = request.get_json(force=True)
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    print("Validating token:", access_token, "for User-ID:", user_id)
    if verify_access_token(connection, user_id, access_token):
        return "Success", 200
    else:
        return "User does not have access", 401

def insert_user(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting user: ", json_data)
    email = json_data["email"].lower()
    phoneNumber = json_data["phoneNumber"]
    password = json_data["password"]
    name = json_data["name"]
    # Insert user into database
    user_id = insert_user_to_database(connection, email, phoneNumber, name, password)

    # Insert default user settings into database
    insert_user_settings_to_database(connection, user_id, False, None, None, None, False)

    return "Success", 201

def insert_sighting(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting pet sighting: ", json_data)

    user_id = json_data["authorId"]
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    missing_report_id = json_data["missingReportId"]
    author_id = json_data["authorId"]
    animal = json_data["animal"]
    breed = json_data["breed"]
    date_time_input = json_data["dateTime"]
    hour, minute, day, month, year = separate_datetime(date_time_input)
    date_time = datetime.datetime(year, month, day, hour, minute)

    date_time_of_creation_input = json_data["dateTimeOfCreation"]
    hour, minute, day, month, year = separate_datetime(date_time_of_creation_input)
    date_time_of_creation = datetime.datetime(year, month, day, hour, minute)

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")
    imageUrl = json_data["imageUrl"]
    description = json_data["description"]


    result = insert_sighting_to_database(connection, missing_report_id, author_id, date_time_of_creation, animal, breed, date_time, location_longitude, location_latitude, imageUrl, description, user_id, access_token)

    if result is False:
        return "User does not have access", 401
    else:
        if missing_report_id is not None:
            send_notification_to_report_author(connection, sighting_data=json_data)
        return "Success", 201

def insert_missing_report(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting report: ", json_data)
    author_id = json_data["authorId"]
    # author_id = 1
    pet_id = json_data["missingPetId"]

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    last_seen_input = json_data["lastSeenDateTime"]
    hour, minute, day, month, year = separate_datetime(last_seen_input)
    last_seen = datetime.datetime(year, month, day, hour, minute)

    date_time_of_creation_input = json_data["dateTimeOfCreation"]
    hour, minute, day, month, year = separate_datetime(date_time_of_creation_input)
    date_time_of_creation = datetime.datetime(year, month, day, hour, minute)

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")

    description = json_data["description"]
    
    missing_report_id = insert_missing_report_to_database(
        connection=connection,
        author_id=author_id,
        date_time_of_creation=date_time_of_creation,
        pet_id=pet_id,
        last_seen=last_seen,
        location_longitude=location_longitude,
        location_latitude=location_latitude,
        description=description,
        user_id=user_id,
        access_token=access_token,
    )

    if missing_report_id is None:
        return "User does not have access", 401
    else:
        from db.pets import update_pet_missing_status
        # Update the status of the missing pet
        update_pet_missing_status(connection, pet_id, True)

        # Send notification to users in the area
        print("Sending notification...")
        send_notification_to_local_users(
            connection=connection,
            missing_report_id=missing_report_id,
        )

        return "Success", 201

def update_missing_report(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    report_id = json_data["reportId"]
    pet_id = json_data["missingPetId"]
    author_id = json_data["ownerId"]

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    last_seen_input = json_data["lastSeen"]
    hour, minute, day, month, year = separate_datetime(last_seen_input)
    last_seen = datetime.datetime(year, month, day, hour, minute)

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")

    description = json_data["description"]
    is_active = json_data["isActive"]

    result = update_missing_report_in_database(connection, report_id, pet_id, author_id, last_seen, location_longitude,
                                      location_latitude, description, is_active, access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def update_report_status(conn):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]

    success = update_report_active_status(
        connection=conn,
        report_id=data["report_id"],
        new_status=data["isActive"],
    )
    if success:
        return "", 200
    return "", 400

def retrieve_location_notification_user_settings(connection, user_id)  -> Tuple[str, int]:
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    print(access_token)
    print(user_id)
    user_settings = retrieve_location_notification_settings(connection, user_id, access_token)

    if user_id is False:
        return "User does not have access", 401
    else:
        return user_settings, 200

def archive_missing_report(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    report_id = json_data["reportId"]
    is_active = json_data["isActive"]

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    result = archive_missing_report_in_database(connection, report_id, is_active, user_id, access_token)

    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def separate_datetime(datetime: str) -> Tuple[int, int, int, int, int]:
    """
    This function takes a datetime (HH:MM dd/mm/yyyy) string and separates the hour, minute, day, month,
    and year into individual components. 
    """
    time, date = datetime.split(" ")

    hour, minute = time.split(":")
    day, month, year = date.split("/")

    return int(hour), int(minute), int(day), int(month), int(year)

def retrieve_missing_reports(connection, author_id) -> Tuple[str, int]:
    """
    This function calls the function that connectionects to the db to retrieve all missing reports or missing reports of an user if author_id is provided.
    """

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    print(access_token)
    print(user_id)
    missing_reports = retrieve_missing_reports_from_database(connection, author_id, user_id, access_token)

    if missing_reports is False:
        return "User does not have access", 401
    else:
        if len(missing_reports) > 0:
            return missing_reports, 200
        elif len(missing_reports) == 0:
            return [], 204

def retrieve_reports_by_pet(connection, pet_id) -> Tuple[str, int]:
    """
    This function calls the function to retrieve missing reports for a specific pet_id.
    """

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    print(access_token)
    print(user_id)
    reports = retrieve_reports_by_pet_id(connection, pet_id, user_id, access_token)

    if reports is False:
        return "User does not have access", 401
    else:
        return reports, 200

def retrieve_sightings(connection, missing_report_id) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve all sightings or sightings for a missing 
    report if its missing_report_id is provided.
    """
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    sightings = retrieve_sightings_from_database(connection, missing_report_id, user_id, access_token)

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204

def retrieve_my_report_sightings(connection) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve all sightings that are linked to a missing pet report 
    made by user_id 
    """
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    sightings = retrieve_my_report_sightings_from_database(connection, user_id, access_token)

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204
    
def retrieve_missing_reports_in_area(connection, longitude, longitude_delta, latitude, latitude_delta) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve missing reports in an area of width longitude_delta, height
    latitude_delta and centre latitude longitude.
    """
    missing_reports = retrieve_missing_reports_in_area_from_database(connection, longitude, longitude_delta, latitude, latitude_delta)
    
    if missing_reports is False:
        return "User does not have access", 401
    else:
        if len(missing_reports) > 0:
            return missing_reports, 200
        elif len(missing_reports) == 0:
            return [], 204
    
def retrieve_sightings_in_area(connection, longitude, longitude_delta, latitude, latitude_delta) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve sightings in an area of width longitude_delta, height
    latitude_delta and centre latitude longitude.
    """
    sightings = retrieve_sightings_in_area_from_database(connection, longitude, longitude_delta, latitude, latitude_delta)

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204

def update_location_notification_settings_api(connection ) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    location_notifications_enabled = json_data["enabled"]
    location_longitude = json_data["long"]
    location_latitude = json_data["lat"]
    location_notification_radius = json_data["radius"]

    result = update_location_notifications_settings_in_database(connection, user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def login(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("user login attempt: ", json_data)
    email = json_data["email"].lower()
    password = json_data["password"]
    print(password)
    user_exists = check_user_exists_in_database(connection, email, password)
    if user_exists:
        user_id, access_token = user_exists  # Unpack the tuple
        return "Success", 200, user_id, access_token  # Return user_id and access_token
    else:
        return "Fail", 401

def retrieve_profile(connection, profile_user_id) -> Tuple[str, int, str, str, str]:

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    user_info = retrieve_user(connection, profile_user_id, user_id, access_token)

    print(user_info)
    if user_info is not False:
        return user_info, 200 # Return profile information
    else:
        return "The user does not have access", 401

def update_profile(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    user_name = json_data["name"]
    user_phone = json_data["phone"]

    result = update_user_details(connection, user_id, user_name, user_phone, access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def change_password(connection, account_user_id: int) -> Tuple[str, int]:
    """
    This function receives the user inputs and calls the change_password_in_database function to change password of the user with ID account_user_id
    """
    json_data = request.get_json(force=True)
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    email = json_data["email"].lower()
    new_password = json_data["password"]
    result = change_password_in_database(connection, email, new_password, account_user_id, user_id, access_token)

    if result is False:
        return "User does not have access", 401
    else:
        return "", 200

def validate_password_reset(username, reset_token, new_password):
    if not verify_username(username):
        return False
    if not verify_reset_token(username, reset_token):
        return False

        # Validate new password
    if not verify_password_requirements(new_password):
        return False

        # Reset password and update user credentials
    reset_password(username, new_password)
    return True

def verify_username(username):
    # Check if username exists in the database
    # Perform necessary validations (e.g., username format, uniqueness, etc.)
    # Return True if the username is valid; otherwise, return False
    return True  # Placeholder, replace with actual validation logic

def verify_reset_token(username, reset_token):
    # Verify if the reset token is valid for the given username
    # Perform necessary validations (e.g., token expiration, uniqueness, etc.)
    # Return True if the token is valid; otherwise, return False
    return True  # Placeholder, replace with actual validation logic

def verify_password_requirements(password):
    # Perform password validation

    # Return True if the password meets the requirements; otherwise, return False
    if len(password) < 8:
        return False
    if not any(char.isdigit() for char in password):
        return False
    if not sys.search(r'[A-Za-z]', password):
        return False
    return True

def reset_password(username, new_password):
    # Update  user's password in database
    # Return True if the password reset was successful; otherwise, return False
    return True
    # Replace with password reset logic

def send_notification_to_report_author(
    connection: psycopg2.extensions.connection,
    sighting_data: Dict[str, Any],
):
    """
    Sends a notification to the author of a missing report

    Arguments:
        connection: Database connection
        sighting_data: Data in sighting
    """

    # Get missing report
    missing_report = get_missing_report(connection=connection, missing_report_id=sighting_data["missingReportId"])

    # Get pet
    pet = get_pet(connection=connection, pet_id=missing_report["pet_id"])

    # Get information of the person who sighted the pet
    sighter = get_user_details(connection=connection, user_id=sighting_data["authorId"])

    # Get owner
    owner = get_user_details(connection=connection, user_id=missing_report["author_id"])

    # Send notification to owner
    title = " Potential Sighting Alert for Your Lost Pet "
    body = generate_email_body_sighting(owner = owner, pet = pet, sighter = sighter, sighting_data = sighting_data)

    
    res = send_notification(
        email_address=owner["email_address"],
        subject=title,
        content=body,
    )
    if res:
        print("Notification sent successfully")
    else:
        print("Notification failed to send")
    return res


def send_notification_to_local_users(
    connection: psycopg2.extensions.connection,
    missing_report_id: int,
):
    """
    Triggered once a missing report is created.
    Sends a notification to users in the area who have opted in.

    Arguments:
        connection: Database connection
        missing_report_id: ID of missing report
    """
    # Get missing report
    missing_report = get_missing_report(connection=connection, missing_report_id=missing_report_id)

    # Get pet
    pet = get_pet(connection=connection, pet_id=missing_report["pet_id"])

    # Get owner
    owner = get_user_details(connection=connection, user_id=missing_report["author_id"])

    # Get users in the area
    local_user_ids = get_local_users(connection=connection, longitude=missing_report["location_longitude"], latitude=missing_report["location_latitude"])
    print(f"IDs of local users: {local_user_ids}")

    # Send notification to each user
    for user_id in local_user_ids:
        if user_id != owner["id"]:
            user = get_user_details(connection=connection, user_id=user_id)

            title = "Missing Pet Alert In Your Area"
            body = f"Hi {user['name']},\n\nA {pet['animal']} named {pet['name']} has been reported missing in your area. Please keep an eye out for it.\n\nThanks,\nPetSight Team"
            res = send_notification(
                email_address=user["email_address"],
                subject=title,
                content=body,
            )
            if res:
                print(f"Notification sent successfully to user ID {user_id}")
            else:
                print(f"Notification failed to send to user ID {user_id}")

