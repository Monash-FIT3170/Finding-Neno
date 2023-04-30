"""
This script changes user's password.
"""

def hash(password: str) -> str:
    """ Do hashing and salting. """

    return ""

def change_password(connection: psycopg2.extensions.connection, user_id: str, new_password: str):

    cur = connection.cursor()
        
    query = """ UPDATE users SET password = %s WHERE id = %s; """

    # Hash and salt password
    hashed_password = hash(new_password)

    # Execute query
    try:
        cur.execute(query, (user_id, new_password))
        connection.commit()
        print(f"Password successfully changed")
    except Exception as e:
        print(f"Error with changing password: " + e)

    cur.close()
# use access token for resetting password
# access token "logs in" user and prompts user to add a new password.
