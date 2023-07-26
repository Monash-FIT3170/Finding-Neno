import psycopg2

def verify_access_token(connection: psycopg2.extensions.connection, user_id: int, access_token: str):
    """
    Verify that the user id matches the access token

    Arguments:
        connection: postgres connection
        user_id: id of the user
        access_token: access token of the user
    Returns:
        True if the user id matches the access token, False otherwise
    """
    cur = connection.cursor()

    query = """SELECT access_token FROM users WHERE id = %s;"""

    try:
        # Execute query
        cur.execute(query, (user_id,))
        access_token_db = cur.fetchone()[0]
        print(f"Query executed successfully: {query}")
        print("hello")
    except Exception as e:
        print(f"Error while executing query: {e}")
        return False

    cur.close()

    return access_token == access_token_db