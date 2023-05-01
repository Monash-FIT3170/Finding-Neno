"""
This script changes user's password.
"""


def hash(password: str) -> str:
    """ Do hashing and salting. """

    return ""

def change_password(connection: psycopg2.extensions.connection, email: int, new_password: str):

    cur = connection.cursor()
        
    query = """ UPDATE users SET password = %s WHERE email = %s; """

    # Hash and salt password
    hashed_password = hash(new_password)

    # Execute query
    try:
        cur.execute(query, (email, new_password))
        connection.commit()
        print(f"Password successfully changed")
    except Exception as e:
        print(f"Error with changing password: {e}")

    cur.close()
# use access token for resetting password
# access token "logs in" user and prompts user to add a new password.


"""
This function will be used for calling the above function which connects to the database. This function
will be moved to the Flask file which handles the user interactions.
"""
def change_password_aux():
    email = request.args.get("email")
    new_password = request.args.get("password")
    change_password(connection = conn, name = email, new_password = new_password)