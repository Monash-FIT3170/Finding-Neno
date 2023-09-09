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

    query = """SELECT * FROM pets WHERE owner_id = %s;"""

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
    is_missing: bool,
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

    query = """INSERT INTO pets (name, animal, breed, description, image_url, ismissing, owner_id) VALUES (%s, %s, %s, %s, %s, %s, %s);"""

    try:
        # Execute query
        cur.execute(query, (name, animal, breed, description, image_url, is_missing, owner_id,))
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

def delete_pet(
    connection: psycopg2.extensions.connection, 
    id: int,
    access_token: str, user_id: int
):
    """
    Deletes an existing pet in the database

    Arguments:
        connection: postgres connection
        id: id of the pet
        access_token: access token of the pet owner
    Returns:
        True if successful, False otherwise
    """

    cur = connection.cursor()
    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    result = False
    try:
        # Get the pet's owner's ID
        query = """SELECT owner_id FROM pets WHERE id = %s;"""
        cur.execute(query, (id,))
        
        
        # Delete the pet
        query = """DELETE FROM pets WHERE id = %s;"""
        cur.execute(query, (id,))
        result = True
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False
    
    cur.close()
    connection.commit()

    return result


def get_owner(
    connection: psycopg2.extensions.connection,
    pet_id: int,
):
    """
    Gets the owner of a pet

    Arguments:
        connection: postgres connection
        pet_id: id of the pet
    Returns:
        The owner of the pet with the following format:
        {
            "id": id of the owner,
            "name": name of the owner,
            "email_address": email of the owner,
            "phone_number": phone number of the owner
        }
    """
    cur = connection.cursor()
    
    query = """
        SELECT users.id, users.name, users.email_address, users.phone_number
        FROM users INNER JOIN pets ON users.id = pets.owner_id
        WHERE pets.id = %s;
    """

    try:
        # Execute query
        cur.execute(query, (pet_id,))
        owner_db = cur.fetchone()
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False
    
    cur.close()

    owner = {
        "id": owner_db[0],
        "name": owner_db[1],
        "email_address": owner_db[2],
        "phone_number": owner_db[3]
    }

    return owner
