# Finding-Neno
Finding Neno is a mobile application created to help pet owners find and reunite with their pets!

All documentation can be found in the team's [Google Drive](https://drive.google.com/drive/u/1/folders/1URib5DxULDa4vhqCTlcQM6K4CIRcmrmG).

## Getting Started

### Requirements and Dependencies

* Python
* pip
* Node: https://nodejs.org/en/download
* Expo CLI
  ```
  npm install -g expo-cli
  ```
* Expo Go on your phone: https://expo.dev/client
* Flask: https://flask.palletsprojects.com/en/2.2.x/installation/
* PostgreSQL: https://www.postgresql.org/download/ (add a new server once installed)
* TablePlus (optional, used to visualise database): https://tableplus.com/  (Create a connection to the database using the details of the PostgreSQL server created in the previous step)

### Installation
Clone the repo
```
git clone https://github.com/Monash-FIT3170/Finding-Neno.git
```

### Configuration
Create a .env file in the root directory. Add the following to the .env file (ensure the variables match that of your PostgreSQL server): 
  ```
   DATABASE_NAME=postgres  
   DATABASE_USER=postgres  
   DATABASE_PASSWORD=password  
   DATABASE_HOST=localhost  
   DATABASE_PORT=5432  
  ``` 
Create a .env file within the src/frontend/finding-neno directory. Add the following to this .env file:  
  ```
  IP=your device’s IP address 
  PORT=5000
  ``` 
Run the following commands from the root directory: 
* Mac users:
  ```
  src/backend/install_dependencies_mac.sh
  ```
* Windows users:
  ```
  src/backend/install_dependencies_windows.bat
  ```
If this does not work, run the following commands instead: 
  ```
  pip3 install psycopg2
  pip3 install python-dotenv
  pip3 install pytest
  pip3 install pytest-mock
  ```
Run the following command from the root directory: 
  ```
  python3 src/backend/db/setup_db.py .env
  ```

## Running the app 

Run the following command from the root directory: 
  ```
  python3 src/backend/api/main.py .env
  ```

In a new terminal, run the following commands from the src/frontend/Finding-Neno directory: 
  ```
  npm install
  npx expo start
  ```

Scan the QR code to start using Finding Neno!

## Notes and Common Issues
* Network error:
  * Stop the server
  * Reset cache by running the command
    ```
    npm cache clean --force
    ```
  * Ensure that your device is on the same IP/network as the server
  * Run the app again 
* psycho2 module not found:
  * Run the command:
    ```
    pip3 install psycopg2-binary
    ```
