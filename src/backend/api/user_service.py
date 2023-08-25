import flask
from flask import request, jsonify
from pathlib import Path
import sys
import datetime
from typing import Tuple

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.authentication import verify_access_token
from db.users_operations import *


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
    insert_user_to_database(connection, email, phoneNumber, name, password)
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
    
    result = insert_missing_report_to_database(connection, pet_id, author_id, date_time_of_creation, last_seen, location_longitude, location_latitude, description, user_id, access_token)

    if result is False:
        return "User does not have access", 401
    else:
        from db.pets import update_pet_missing_status
        update_pet_missing_status(connection, pet_id, False)
        return "Success", 201

def update_missing_report(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    report_id = json_data["reportId"]
    #pet_id = json_data["missingPetId"]
    author_id = json_data["ownerId"]

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    #last_seen_input = json_data["lastSeen"]
    #hour, minute, day, month, year = separate_datetime(last_seen_input)
    #last_seen = datetime.datetime(year, month, day, hour, minute)

    #coordinates = json_data["lastLocation"]
    #location_longitude, location_latitude = coordinates.split(",")

    #description = json_data["description"]
    is_active = json_data["isActive"]

    result = update_missing_report_in_database(connection, report_id, is_active, access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

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
    This function calls the function that connectionects to the db to retrieve all sightings or sightings for a missing 
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

