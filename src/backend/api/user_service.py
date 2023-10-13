import flask
from flask import request, jsonify
from pathlib import Path
import sys
import datetime
from typing import Tuple, Dict, Any
from typing import Tuple, Dict, Any
from get_suburb import get_suburb

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.authentication import verify_access_token
from db.users_operations import *
from db.delete_user import delete_all_user_data_from_database
from db.pets import get_pet
from api.notification_bodies import generate_email_body_sighting, generate_email_missing_report, generate_email_potential_sighting

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
    
    user_exists = check_user_exists(connection, email, phoneNumber)
    if not user_exists:
        return 'User already exists', 409
    # Insert user into database
    user_id = insert_user_to_database(connection, email, phoneNumber, name, password)

    # Insert default user settings into database
    insert_user_settings_to_database(connection, user_id, False, None, None, None, False)

    return "Success", 201

def validate_password_operation(connection):
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    json_data = request.get_json(force=True)
    to_check_id = json_data["toCheckId"]
    password = json_data["password"]

    result = check_user_password(connection=connection, to_check_id=to_check_id, password=password, user_id=user_id, access_token=access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return jsonify(result), 200

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
    stripped_datetime = date_time_input[:-1] # strip the last character from the UTC string
    date_obj = datetime.datetime.strptime(stripped_datetime, "%Y-%m-%dT%H:%M:%S.%f")
    date_time_of_creation = json_data["dateTimeOfCreation"]
    stripped_creation_datetime = date_time_of_creation[:-1] # strip the last character from the UTC string
    date_obj_of_creation = datetime.datetime.strptime(stripped_creation_datetime, "%Y-%m-%dT%H:%M:%S.%f")

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")
    location_string = get_suburb(location_latitude, location_longitude)
    imageUrl = json_data["imageUrl"]
    description = json_data["description"]


    sighting_id = insert_sighting_to_database(connection=connection, missing_report_id=missing_report_id, author_id=author_id, 
                                         animal=animal, breed=breed, date_time=date_obj, date_time_creation=date_obj_of_creation, 
                                         location_longitude=location_longitude, location_latitude=location_latitude, location_string=location_string, 
                                         image_url=imageUrl, description=description, 
                                         user_id=user_id, access_token=access_token)

    if sighting_id is None:
        return "User does not have access", 401
    else:
        # Send notification to the author of the missing report
        if missing_report_id is not None:
            send_notification_to_report_author(connection=connection, sighting_data=json_data)
        else:
            # Send notifications to possible nearby owners
            send_notification_to_possible_owners(connection=connection, sighting_data=json_data)

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
    stripped_datetime = last_seen_input[:-1] # strip the last character from the UTC string
    last_seen = datetime.datetime.strptime(stripped_datetime, "%Y-%m-%dT%H:%M:%S.%f")
    date_time_of_creation = json_data["dateTimeOfCreation"]
    stripped_creation_datetime = date_time_of_creation[:-1] # strip the last character from the UTC string
    date_time_creation = datetime.datetime.strptime(stripped_creation_datetime, "%Y-%m-%dT%H:%M:%S.%f")

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")
    location_string = get_suburb(location_latitude, location_longitude)

    description = json_data["description"]
    
    missing_report_id = insert_missing_report_to_database(connection=connection, pet_id=pet_id, author_id=author_id, 
                                               last_seen=last_seen, date_time_creation=date_time_creation, 
                                               location_longitude=location_longitude, location_latitude=location_latitude, 
                                               location_string=location_string, description=description, 
                                               user_id=user_id, access_token=access_token)

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
    stripped_datetime = last_seen_input[:-1] # strip the last character from the UTC string
    last_seen = datetime.datetime.strptime(stripped_datetime, "%Y-%m-%dT%H:%M:%S.%f")

    coordinates = json_data["lastLocation"]
    location_longitude, location_latitude = coordinates.split(",")

    description = json_data["description"]
    is_active = json_data["is_active"]

    result = update_missing_report_in_database(
        connection=connection, 
        report_id=report_id, 
        pet_id=pet_id, 
        author_id=author_id, 
        last_seen=last_seen, 
        location_longitude=location_longitude, location_latitude=location_latitude, 
        description=description, 
        is_active=is_active, 
        access_token=access_token
    )

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
        new_status=data["is_active"],
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
    is_active = json_data["is_active"]

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    result = archive_missing_report_in_database(connection, report_id, is_active, user_id, access_token)

    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201


def retrieve_missing_reports(connection, author_id) -> Tuple[str, int]:
    """
    This function calls the function that connectionects to the db to retrieve all missing reports or missing reports of an user if author_id is provided.
    """

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    print(access_token)
    print(user_id)
    missing_reports = retrieve_missing_reports_from_database(connection=connection, author_id=author_id, 
                                                             user_id=user_id, access_token=access_token)

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
    reports = retrieve_reports_by_pet_id(connection=connection, pet_id=pet_id, 
                                         user_id=user_id, access_token=access_token)

    if reports is False:
        return "User does not have access", 401
    else:
        return reports, 200
    

def retrieve_sightings(connection, missing_report_id, expiry_time) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve all sightings or sightings for a missing 
    report if its missing_report_id is provided.
    """
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    sightings = retrieve_sightings_from_database(
        connection=connection, 
        missing_report_id=missing_report_id, 
        expiry_time=expiry_time, 
        user_id=user_id, access_token=access_token
    )

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204
    
def unlink_sightings_by_report(connection, missing_report_id) -> Tuple[str, int]: 
    """
    This function calls the function that connects to the db to unlink sightings from a missing report if its missing_report_id is provided.
    """
    token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    success = unlink_sightings_by_report_id(
        connection=connection,
        missing_report_id=missing_report_id,
        access_token=token,
        user_id=user_id
    )
    if success:
        return jsonify({'message': 'Sightings unlinked successfully'}), 201
    else:
        return jsonify({'message': 'Failed to unlink sightings'}), 500


def retrieve_my_report_sightings(connection) -> Tuple[str, int]:
    """
    This function calls the function that connects to the db to retrieve all sightings that are linked to a missing pet report 
    made by user_id 
    """
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    sightings = retrieve_my_report_sightings_from_database(
        connection=connection, 
        user_id=user_id, 
        access_token=access_token
    )

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
    missing_reports = retrieve_missing_reports_in_area_from_database(
        connection=connection, 
        longitude=longitude, longitude_delta=longitude_delta, 
        latitude=latitude, latitude_delta=latitude_delta
    )
    
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
    sightings = retrieve_sightings_in_area_from_database(
        connection=connection, 
        longitude=longitude, longitude_delta=longitude_delta, 
        latitude=latitude, latitude_delta=latitude_delta
    )

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204

def retrieve_saved_sightings(connection) -> Tuple[str,int]:
    """
    This function calls the function that connects to the db to retrieve sightings that an user has saved
    """
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    sightings = retrieve_user_saved_sightings(connection, user_id, access_token)

    if sightings is False:
        return "User does not have access", 401
    else:
        if len(sightings) > 0:
            return sightings, 200
        elif len(sightings) == 0:
            return [], 204

def save_user_sighting(connection) -> Tuple[str,int]:
    """
    This function calls the function that connects to the db to insert a sighting that a user has saved
    """
    json_data = request.get_json(force=True)
    print("saving a sighting for user: ", json_data)

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    sighting_id = json_data["sightingId"]

    sightings = save_sighting_for_user(connection, user_id, access_token, sighting_id)

    if sightings is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def unsave_user_sighting(connection) -> Tuple[str,int]:
    """
    This function calls the function that connects to the db to insert a sighting that a user has unsaved
    """
    json_data = request.get_json(force=True)
    print("unsaving a sighting for user: ", json_data)

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    sighting_id = json_data["sightingId"]

    sightings = unsave_sighting_for_user(connection, user_id, access_token, sighting_id)

    if sightings is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def update_location_notification_settings_api(connection ) -> Tuple[str, int]:
    json_data = request.get_json(force=True)

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    location_notifications_enabled = json_data["enabled"]
    location_longitude = json_data["long"]
    location_latitude = json_data["lat"]
    location_notification_radius = json_data["radius"]
    possible_sightings_enabled = json_data["possible_sightings"]

    result = update_location_notifications_settings_in_database(connection, user_id, location_notifications_enabled, location_longitude, location_latitude, location_notification_radius, possible_sightings_enabled, access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 201

def login(connection) -> Tuple[str, int]:
    json_data = request.get_json(force=True)
    print("user login attempt: ", json_data)
    username = json_data["username"].lower()
    password = json_data["password"]
    print(password)
    user_exists = check_user_login_details(connection, username, password)
    if user_exists:
        user_id, access_token = user_exists  # Unpack the tuple
        return "Success", 200, user_id, access_token  # Return user_id and access_token
    else:
        return "Fail", 401

def retrieve_profile(connection, profile_user_id) -> Tuple[str, int, str, str, str]:

    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    user_info = retrieve_user(connection, profile_user_id, user_id, access_token)

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

def delete_all_user_data(connection, to_delete_id):
    access_token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]
    
    json_data = request.get_json(force=True)
    to_delete_id = json_data["toDeleteId"]

    result = delete_all_user_data_from_database(connection=connection, to_delete_id=to_delete_id, user_id=user_id, access_token=access_token)
    if result is False:
        return "User does not have access", 401
    else:
        return "Success", 200


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

    # Get users in the area
    local_user_ids = get_local_users(connection=connection, longitude=missing_report["location_longitude"], latitude=missing_report["location_latitude"])

    # Send notification to each user
    for user_id in local_user_ids:
        if user_id != missing_report["author_id"]:
            user = get_user_details(connection=connection, user_id=user_id)

            title = "Missing Pet Alert In Your Area"
            body = generate_email_missing_report(pet, missing_report, user)
            res = send_notification(
                email_address=user["email_address"],
                subject=title,
                content=body,
            )
            if res:
                print(f"Notification sent successfully to user ID {user_id}")
            else:
                print(f"Notification failed to send to user ID {user_id}")


def send_notification_to_possible_owners(
    connection: psycopg2.extensions.connection,
    sighting_data: Dict[str, Any],
):
    """
    Triggered once a sighting is created.
    Sends a notification to users in the area who have created a missing report with
    similar details to the sighting.

    Arguments:
        connection: Database connection
        sighting_data: Data in sighting
    """
    RADIUS = 20 # km
    possible_owners = get_possible_owners(
        connection=connection,
        longitude=sighting_data["lastLocation"].split(",")[0],
        latitude=sighting_data["lastLocation"].split(",")[1],
        radius=RADIUS,
        animal=sighting_data["animal"],
        breed=sighting_data["breed"],
    )

    if possible_owners is not None:
        for owner_id in possible_owners:
            # Get user details
            user = get_user_details(connection=connection, user_id=owner_id)

            # Get information of the person who sighted the pet
            sighter = get_user_details(connection=connection, user_id=sighting_data["authorId"])

            # Send notification to owner
            title = "Potential Sighting Alert for Your Lost Pet"
            body = generate_email_potential_sighting(sighting_data, sighter, user)
            res = send_notification(
                email_address=user["email_address"],
                subject=title,
                content=body,
            )
            if res:
                print(f"Notification sent successfully to user ID {user['id']}")
            else:
                print(f"Notification failed to send to user ID {user['id']}")
