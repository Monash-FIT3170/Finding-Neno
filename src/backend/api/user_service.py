import flask
from flask import request, jsonify
from pathlib import Path
import sys
import datetime
from typing import Tuple

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.users_operations import insert_user_to_database, insert_missing_report_to_database, retrieve_missing_reports_from_database, change_password_in_database, check_user_exists_in_database, update_missing_report_in_database, archive_missing_report_in_database, retrieve_user, insert_new_sighting_to_database

def insert_user(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting user: ", json_data)
    email = json_data["email"].lower()
    phoneNumber = json_data["phoneNumber"]
    password = json_data["password"]
    name = json_data["name"]
    insert_user_to_database(conn, email, phoneNumber, name, password)
    return "", 201

def insert_new_sighting(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting pet sighting: ", json_data)

    missing_report_id = json_data["missing_report_id"] 
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
    image_url = json_data["image_url"]
    description = json_data["description"]

    insert_new_sighting_to_database(conn, missing_report_id, author_id, date_time_of_creation, animal, breed, date_time, location_longitude, location_latitude, image_url, description)
    return "Success", 201

def insert_missing_report(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("inserting report: ", json_data)
    author_id = json_data["authorId"]
    # author_id = 1
    pet_id = json_data["missingPetId"]

    last_seen_input = json_data["lastSeenDateTime"]
    hour, minute, day, month, year = separate_datetime(last_seen_input)
    last_seen = datetime.datetime(year, month, day, hour, minute)

    date_time_of_creation_input = json_data["dateTimeOfCreation"]
    hour, minute, day, month, year = separate_datetime(date_time_of_creation_input)
    date_time_of_creation = datetime.datetime(year, month, day, hour, minute)

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")

    description = json_data["description"]
    
    insert_missing_report_to_database(conn, pet_id, author_id, date_time_of_creation, last_seen, location_longitude, location_latitude, description)
    return "Success", 201

def update_missing_report(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    report_id = json_data["reportId"]
    pet_id = json_data["missingPetId"]
    author_id = json_data["ownerId"]

    last_seen_input = json_data["lastSeen"]
    hour, minute, day, month, year = separate_datetime(last_seen_input)
    last_seen = datetime.datetime(year, month, day, hour, minute)

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")

    description = json_data["description"]
    is_active = json_data["isActive"]

    update_missing_report_in_database(conn, report_id, pet_id, author_id, last_seen, location_longitude,
                                      location_latitude, description, is_active)
    return "Success", 201

def archive_missing_report(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    report_id = json_data["reportId"]
    is_active = json_data["isActive"]

    archive_missing_report_in_database(conn, report_id, is_active)
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

def retrieve_missing_reports(conn, owner_id) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve missing reports of an owner.
    """
    missing_reports = retrieve_missing_reports_from_database(conn, owner_id)

    if len(missing_reports) > 0:
        return missing_reports, 200
    elif len(missing_reports) == 0:
        return [], 204
    else:
        return "Fail", 400

def login(conn) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("user login attempt: ", json_data)
    email = json_data["email"].lower()
    password = json_data["password"]
    print(password)
    user_exists = check_user_exists_in_database(conn, email, password)
    if user_exists:
        user_id, access_token = user_exists  # Unpack the tuple
        return "Success", 200, user_id, access_token  # Return user_id and access_token
    else:
        return "Fail", 401


def retrieve_profile(conn, user_id) -> Tuple[str, int, str, str, str]:

    auth_header = flask.request.headers.get('Authorization')
    token = auth_header.split()[1]

    user_info = retrieve_user(conn, user_id, token)

    if user_info is not False:
        email, phone, name = user_info
        return "Success", 200, name, email, phone  # Return profile information
    else:
        return "Fail", 401


def change_password(connection) -> Tuple[str, int]:
    """
    This function receives the user inputs and calls the change_password_in_database function to change password.
    """
    json_data = request.get_json(force=True)
    email = json_data["email"].lower()
    new_password = json_data["password"]
    change_password_in_database(connection = connection, email = email, new_password = new_password)
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

