import psycopg2
from db.users_operations import verify_access_token

"""
This file contains functions that delete a user from the database.
"""

def delete_all_user_data_from_database(connection: psycopg2.extensions.connection, to_delete_id: int, user_id: int, access_token: str):
    """
    This function deletes the user with the provided id from the database. It first deletes all sightings the user created, unlinks any sightings made
    by other users on this user's missing reports, and then deletes the user's missing reports before deleting the user's pets. 
    Finally, it deletes the user from the database.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    print(to_delete_id)

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False
    
    # Delete user's saved sightings
    if not delete_user_saved_sightings(connection=connection, user_id=to_delete_id):
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


def delete_user_saved_sightings(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function deletes all saved sightings of the user.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM users_saved_sightings WHERE user_id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"User saved sightings successfully deleted")
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False

def delete_all_user_sightings(connection: psycopg2.extensions.connection, user_id: int):
    """
    This function deletes all sightings made by the user.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM sightings WHERE author_id = %s;
    """

    try:
        cur.execute(query, (user_id, ))

        # Commit the change
        connection.commit()
        print(f"Sightings successfully deleted")
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False

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
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False

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
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False

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
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False

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
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False