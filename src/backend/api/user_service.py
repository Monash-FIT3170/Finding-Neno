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
    body = generate_email_body(owner = owner, pet = pet, sighter = sighter, sighting_data = sighting_data)

    
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


def generate_email_body(owner, pet, sighter, sighting_data):
    """Generates and returns the body of the email to be sent to the owner of a missing pet

    Args:
        owner: the owner of the missing pet 
        pet: the missing pet
        sighter: the person who sighted the pet
        sighting_data: the data of the sighting
    """
    location_longitude, location_latitude = sighting_data['lastLocation'].split(",")
    html_code = f""" <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
            a {{text-decoration: none;}}
        </style>
        <![endif]--><!--[if gte mso 9]>
        <style>sup {{ font-size: 100% !important; }}</style>
        <![endif]--><!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {{
            max-height:0px!important;
            display:none!important;
            }}
            .rollover:hover .rollover-second {{
            max-height:none!important;
            display:inline-block!important;
            }}
            .rollover div {{
            font-size:0px;
            }}
            u ~ div img + div > div {{
            display:none;
            }}
            #outlook a {{
            padding:0;
            }}
            span.MsoHyperlink,
            span.MsoHyperlinkFollowed {{
            color:inherit;
            mso-style-priority:99;
            }}
            a.es-button {{
            mso-style-priority:100!important;
            text-decoration:none!important;
            }}
            a[x-apple-data-detectors] {{
            color:inherit!important;
            text-decoration:none!important;
            font-size:inherit!important;
            font-family:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
            }}
            .es-desk-hidden {{
            display:none;
            float:left;
            overflow:hidden;
            width:0;
            max-height:0;
            line-height:0;
            mso-hide:all;
            }}
            .es-button-border:hover > a.es-button {{
            color:#ffffff!important;
            }}
            @media only screen and (max-width:600px) {{*[class="gmail-fix"] {{ display:none!important }} p, a {{ line-height:150%!important }} h1, h1 a {{ line-height:120%!important }} h2, h2 a {{ line-height:120%!important }} h3, h3 a {{ line-height:120%!important }} h4, h4 a {{ line-height:120%!important }} h5, h5 a {{ line-height:120%!important }} h6, h6 a {{ line-height:120%!important }} h1 {{ font-size:30px!important; text-align:left }} h2 {{ font-size:24px!important; text-align:left }} h3 {{ font-size:20px!important; text-align:left }} h4 {{ font-size:24px!important; text-align:left }} h5 {{ font-size:20px!important; text-align:left }} h6 {{ font-size:16px!important; text-align:left }} .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {{ font-size:30px!important }} .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {{ font-size:24px!important }} .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {{ font-size:20px!important }} .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a {{ font-size:24px!important }} .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a {{ font-size:20px!important }} .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a {{ font-size:16px!important }} .es-menu td a {{ font-size:14px!important }} .es-header-body p, .es-header-body a {{ font-size:14px!important }} .es-content-body p, .es-content-body a {{ font-size:14px!important }} .es-footer-body p, .es-footer-body a {{ font-size:14px!important }} .es-infoblock p, .es-infoblock a {{ font-size:12px!important }} .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 {{ text-align:center!important }} .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 {{ text-align:right!important }} .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 {{ text-align:justify!important }} .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 {{ text-align:left!important }} .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img {{ display:inline!important }} .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second {{ display:inline!important }} .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div {{ line-height:0!important; font-size:0!important }} .es-spacer {{ display:inline-table }} a.es-button, button.es-button {{ font-size:18px!important }} a.es-button, button.es-button {{ display:inline-block!important }} .es-button-border {{ display:inline-block!important }} .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button {{ display:block!important }} .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu {{ display:inline-block!important }} .es-adaptive table, .es-left, .es-right {{ width:100%!important }} .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header {{ width:100%!important; max-width:600px!important }} .adapt-img {{ width:100%!important; height:auto!important }} .es-mobile-hidden, .es-hidden {{ display:none!important }} .es-desk-hidden {{ width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important }} tr.es-desk-hidden {{ display:table-row!important }} table.es-desk-hidden {{ display:table!important }} td.es-desk-menu-hidden {{ display:table-cell!important }} .es-menu td {{ width:1%!important }} table.es-table-not-adapt, .esd-block-html table {{ width:auto!important }} .es-social td {{ padding-bottom:10px }} .h-auto {{ height:auto!important }} }}
        </style>
    </head>
    <body style="width:100%;height:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#F6F6F6">
            <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f6f6f6"></v:fill>
            </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                <tr>
                <td valign="top" style="padding:0;Margin:0">
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" bgcolor="transparent" style="padding:0;Margin:0">
                            <table class="es-content-body" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://sgcmot.stripocdn.email/content/guids/CABINET_d15f1af50b484478c138f46c75b97b7c0f5a9326a32d75113493ae7ac3996480/images/g206d4c2bd96809dbd75f777c18d9e95703ee4887f0f01fd50224c3fc4e3f5a33f1298c10be79fc13eeb3362861c2447d_640_mZI.jpeg" alt="" width="560" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                    <td align="left" style="padding:0;Margin:0">
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Dear {owner['name']},&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We hope this message finds you well. We understand the emotional toll of losing a beloved pet, and we're committed to helping you reunite with your furry friend. We have some promising news to share with you today.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">It appears that someone in our community may have spotted a pet that matches the description of your beloved companion! We want to keep you informed and provide you with all the details. Here's the information we have received:&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Potential Sighting Details:</strong></p>
                                                        <ul style="list-style-type:circle">
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Date and Time: {sighting_data['dateTime']}</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Location:<a href="https://maps.google.com/?q={location_latitude},{location_longitude}">{location_latitude + ', ' + location_longitude}</a></p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Description: {sighting_data['description']}&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Picture: See picture at this link {sighting_data['imageUrl']}&nbsp;</p>
                                                            </li>
                                                        </ul>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">This sighting has been posted by a fellow member of our community who cares about reuniting lost pets with their loving owners. While we cannot guarantee that this is indeed your pet, we encourage you to take immediate action.</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Here's what you can do:&nbsp;&nbsp;</strong></p>
                                                        <ol>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"> <strong>Contact the Poster:</strong>&nbsp; Send a private message to the member who reported the sighting. They may have more information to share or could assist you further. Their contact details are: 
                                                                    <ul style="list-style-type:circle">
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Name: {sighter['name']} </p>
                                                                        </li>
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Email address: <a href="mailto:{sighter['email_address']}">{sighter['email_address']}</a></p>
                                                                        </li>
                                                                        <li>
                                                                            <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Phone number: <a href="tel:{sighter['phone_number']}">{sighter['phone_number']}</a>.</p>
                                                                        </li>
                                                                    </ul>
                                                                  <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Please be in touch with them as soon as possible to see if they can help.&nbsp;&nbsp; </p>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Visit the Location:</strong>&nbsp;If the sighting location is nearby, consider visiting it as soon as possible. Bring a recent photo of your pet and any identification or documentation you have.&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Alert Local Authorities:</strong>&nbsp;If the sighting is in a public area, you may want to notify your local animal control or shelter. They can help you navigate the situation and provide guidance.&nbsp;&nbsp;</p>
                                                            </li>
                                                            <li>
                                                                <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Stay Hopeful:</strong>&nbsp;While this is an encouraging lead, remember that not all sightings result in a reunion. However, maintaining hope and staying proactive greatly increase the chances of bringing your pet back home.&nbsp;&nbsp;</p>
                                                            </li>
                                                        </ol>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We understand that this can be a stressful time, but we are here to support you every step of the way. Feel free to reach out to us if you need any assistance or have questions.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We sincerely hope that this sighting leads to a joyful reunion between you and your furry companion. Our community is here to rally behind you, offering support and encouragement throughout this journey.&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Remember, there are many success stories of lost pets being found, and we're committed to making yours one of them.&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Wishing you the best of luck in the search for your beloved pet!&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Warm regards,&nbsp;&nbsp;</p>
                                                        <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">The Finding Neno Team</p>
                                                    </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-left:20px;padding-bottom:20px">
                                        <!--[if mso]>
                                        <table style="width:560px" cellpadding="0"
                                        cellspacing="0">
                                        <tr>
                                            <td style="width:270px" valign="top">
                                                <![endif]-->
                                                <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                    <tr>
                                                    <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td align="center" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://sgcmot.stripocdn.email/content/guids/CABINET_d15f1af50b484478c138f46c75b97b7c0f5a9326a32d75113493ae7ac3996480/images/logo_1.png" alt="" width="270" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                            </td>
                                            <td style="width:20px"></td>
                                            <td style="width:270px" valign="top">
                                                <![endif]-->
                                                <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                                    <tr>
                                                    <td align="left" style="padding:0;Margin:0;width:270px">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                                <td style="padding:0;Margin:0;display:none" align="center"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                            </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                    </table>
                </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    """
    return html_code
