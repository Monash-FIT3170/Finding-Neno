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


def get_pet(
        connection: psycopg2.extensions.connection,
        pet_id: int
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
