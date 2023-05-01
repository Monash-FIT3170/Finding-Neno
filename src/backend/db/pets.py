import psycopg2
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
        return False

    cur.close()

    pets = [{
        "id": pet[0], 
        "name": pet[1], 
        "animal": pet[2], 
        "breed": pet[3], 
        "description": pet[4], 
        "image_url": pet[5], 
        "owner_id": pet[6]
    } for pet in pets]

    return pets


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

    try:
        # Execute query
        cur.execute(query, (name, animal, breed, description, image_url, owner_id, id))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False

    cur.close()
    connection.commit()

    return True
