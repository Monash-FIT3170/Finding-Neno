import psycopg2
import sys
from pathlib import Path

file = Path(__file__).resolve()
parent = file.parents[0]
sys.path.append(str(parent))

from authentication import verify_access_token


def get_all_pets(
    connection: psycopg2.extensions.connection, 
    owner_id: int,
    access_token: str,
):
    """
    Returns all pets in the database

    Arguments:
        connection: postgres connection
        owner_id: id of the pet owner
        access_token: access token of the pet owner
    Returns:
        List of pets
    """
    # Verify access token
    if not verify_access_token(connection, owner_id, access_token):
        return False
    
    cur = connection.cursor()

    query = """SELECT * FROM pets WHERE owner_id = %s ORDER BY name;"""

    try:
        # Execute query
        cur.execute(query, (owner_id,))
        pets = cur.fetchall()
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return []

    cur.close()

    pets = [{
        "id": pet[0], 
        "name": pet[1], 
        "animal": pet[2], 
        "breed": pet[3], 
        "description": pet[4], 
        "image_url": pet[5], 
        "is_missing": pet[6],
        "owner_id": pet[7],
    } for pet in pets]

    return pets


def get_pet(
        connection: psycopg2.extensions.connection,
        pet_id: int,
):
    """
    Returns a pet by the given id

    Arguments:
        connection: postgres connection
        pet_id: id of pet
    Returns:
        A pet
    """

    cur = connection.cursor()

    query = """SELECT * FROM pets WHERE id = %s LIMIT 1;"""

    try:
        # Execute query
        cur.execute(query, (pet_id,))
        pet = cur.fetchall()
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False

    cur.close()

    res = pet[0]
    pet = {
        "id": res[0],
        "name": res[1],
        "animal": res[2],
        "breed": res[3],
        "description": res[4],
        "image_url": res[5],
        "owner_id": res[6]
    }

    return pet


def add_pet(
    connection: psycopg2.extensions.connection, 
    name: str, 
    animal: str, 
    breed: str, 
    description: str, 
    image_url: str, 
    owner_id: int, 
    access_token: str,
):
    """
    Adds a pet to the database

    Arguments:
        connection: postgres connection
        name: name of the pet
        animal: type of animal
        breed: breed of the pet
        description: description of the pet
        image_url: url of the image of the pet
        owner_id: id of the pet owner
        access_token: access token of the pet owner
    Returns:
        True if successful, False otherwise
    """
    # Verify access token
    if not verify_access_token(connection, owner_id, access_token):
        return False

    cur = connection.cursor()

    query = """INSERT INTO pets (name, animal, breed, description, image_url, owner_id) VALUES (%s, %s, %s, %s, %s, %s);"""

    try:
        # Execute query
        cur.execute(query, (name, animal, breed, description, image_url, owner_id,))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False

    cur.close()
    connection.commit()

    return True


def edit_pet(
    connection: psycopg2.extensions.connection, 
    id: int,
    name: str, 
    animal: str, 
    breed: str, 
    description: str, 
    image_url: str, 
    owner_id: int, 
    access_token: str,
):
    """
    Edits an existing pet in the database

    Arguments:
        connection: postgres connection
        id: id of the pet
        name: name of the pet
        animal: type of animal
        breed: breed of the pet
        description: description of the pet
        image_url: url of the image of the pet
        owner_id: id of the pet owner
        access_token: access token of the pet owner
    Returns:
        True if successful, False otherwise
    """
    # Verify access token
    if not verify_access_token(connection, owner_id, access_token):
        return False

    cur = connection.cursor()

    query = """UPDATE pets SET name = %s, animal = %s, breed = %s, description = %s, image_url = %s, owner_id = %s WHERE id = %s;"""


    result = False
    try:
        # Execute query
        cur.execute(query, (name, animal, breed, description, image_url, owner_id, id))
        result = True
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    cur.close()
    connection.commit()

    return result

def update_pet_missing_status(connection: psycopg2.extensions.connection, pet_id: int, new_status: bool) -> bool:

    result = False
    try:
        cur = connection.cursor()

        # Update the missing status in the database
        cur.execute("UPDATE pets SET isMissing = %s WHERE id = %s;", (new_status, pet_id))

        connection.commit()
        cur.close()
        result = True
    
    except Exception as e:
        print(f"Error updating status: {e}")
        connection.rollback()

    return result


def delete_all_pet_data_from_database(connection: psycopg2.extensions.connection, to_delete_id: int, user_id: int, access_token: str):
    """
    This function deletes the pet with the provided id

    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        print("Access token verification failed.")
        return False
    
    if not unlink_pet_sightings_from_user_reports(connection=connection, user_id=user_id, pet_id=to_delete_id):
        print("Failed to unlink sightings from user reports.")
        return False

    # Delete pet's missing reports
    if not delete_pet_reports(connection=connection, user_id=user_id, pet_id=to_delete_id):
        print("Failed to delete pet's missing reports.")
        return False

    # Delete pet
    if not delete_pet(connection=connection, user_id=user_id, pet_id=to_delete_id):
        print("Failed to delete pet.")
        return False

    return True


def unlink_pet_sightings_from_user_reports(connection: psycopg2.extensions.connection, user_id: int, pet_id: int):
    """
    This function unlinks sightings on this user's pet's missing reports.
    """

    cur = connection.cursor()

    query = """
        UPDATE sightings SET missing_report_id = NULL WHERE missing_report_id IN (SELECT id FROM missing_reports WHERE author_id = %s AND pet_id = %s);
    """

    try:
        cur.execute(query, (user_id, pet_id))

        # Commit the change
        connection.commit()
        print(f"Sightings successfully unlinked")
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False


def delete_pet_reports(connection: psycopg2.extensions.connection, user_id: int, pet_id: int):
    """
    This function deletes all missing reports created by the user for a pet.
    """

    cur = connection.cursor()

    query = """
        DELETE FROM missing_reports WHERE author_id = %s AND pet_id = %s;
    """

    try:
        cur.execute(query, (user_id, pet_id))

        # Commit the change
        connection.commit()
        print(f"Missing reports successfully deleted")
        return True

    except Exception as e:
        print(f"Error with deleting user: {e}")
    
    cur.close()
    return False


def delete_pet(connection, user_id, pet_id):
    """
    This function deletes the pet that is selected.
    """
    
    cur = connection.cursor()

    query = """
        DELETE FROM pets WHERE owner_id = %s AND id = %s;
    """
    
    try:
        cur.execute(query, (user_id, pet_id))
        connection.commit()
        print(f"Pet successfully deleted")
        return True
    
    except Exception as e:
        print(f"Error while deleting pet: {e}")

    cur.close()
    return False
