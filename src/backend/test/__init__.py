from dotenv import load_dotenv
from flask import Flask
from api.main import get_connection, create_database_pool

database_pool = None
environment_file_path = ".env"
app = Flask(__name__)

if __name__ == "__main__":
    # Load environment variables
    load_dotenv(environment_file_path)

    database_pool = create_database_pool()

    app.run(host="0.0.0.0", debug=True)