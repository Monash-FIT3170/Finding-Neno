# Finding Neno
Finding Neno is a mobile application created to help pet owners find and reunite with their lost pets!

Finding Neno currently has the following features: 
* Signup, login and logout
* A dashboard that displays recent pet sightings and missing pet reports
* A 'My Reports' page which displays the user's own missing pet reports 
* A map view that displays pet sightings and reports on a map
* Adding pets to your profile and editing its details
* Creating a missing pet report, creating a pet sighting
* Creating a pet sighting for a specific missing pet report
* Resolving a report by marking a pet as found 

Detailed documentation can be found in the team's [Google Drive](https://drive.google.com/drive/u/1/folders/1URib5DxULDa4vhqCTlcQM6K4CIRcmrmG).

## Getting Started (for running on your local machine)

### Hardware Requirements 
* A Windows or Mac machine
* A smartphone (or Simulator on Mac devices)

### Software Requirements and Dependencies

* Python (including pip)
* Node v10.2.0: https://nodejs.org/en/download
* Expo CLI SDK 49
  ```
  npm install -g expo-cli
  ```
* Expo Go on your phone: https://expo.dev/client
* PostgreSQL: https://www.postgresql.org/download/ (add a new server once installed)
* TablePlus (optional, used to visualise database): https://tableplus.com/  (Create a connection to the database using the details of the PostgreSQL server created in the previous step)
* React v18.2.0
* CORS v3.0.10: look at Configuration
* Flask v2.2.3: look at Configuration
* GUnicorn v20.0.4: look at Configuration
* psycopg2 v2.9.5: look at Configuration
* pytest v7.2.2: look at Configuration
* pytest-mock v3.11.1: look at Configuration
* python-dotenv v1.0.0: look at Configuration
* geopy v2.4.0: look at Configuration
* requests v2.31.0: look at Configuration

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

   SENDGRID_API_KEY=<REDACTED> # Speak to @josiahschuller to get a key.
  ``` 
Create a .env file within the `src/frontend/Finding-Neno` directory. Add the following to this .env file:  
  ```
  API_URL=the URL outputted when the back-end API is run
  ``` 
Install backend dependencies: 

```
pip3 install -r src/backend/requirements.txt
```

Set up the database structure: 
  ```
  python3 src/backend/db/setup_db.py .env
  ```

## Running the app (Locally)
1. Start the server via pgAdmin
2. Run the following command from the root directory: 
  ```
  python3 src/backend/api/main.py .env
  ```

3. In a new terminal, run the following commands from the `src/frontend/Finding-Neno` directory: 
  ```
  npm install
  npm start
  ```

4. Scan the QR code
5. Select "Expo Go" to start using Finding Neno!

## Deployment (Discontinued in December 2023)
<b>IMPORTANT</b>: As of December 2023, the Heroku setup used for deployment
will be discontinued due to costs.

The front-end is bundled into an Android build using Expo Application Services (EAS). This build connects to the deployed
back-end on Heroku and can be downloaded on Android devices with a recent Android version.

The back-end is re-deployed and the front-end is re-bundled for every push to the main branch in the repository through 
a CI/CD pipeline. In order to find a link to a downloadable Android build, see the “Build preview application” stage in 
the “frontend-build” job in the GitHub Actions section of the repository.


## Versioning

Versioning follows the Semantic Versioning 2.0 (https://semver.org)

## How to submit a Pull Request

### Title: 
For user story branches: the title of the pull request should be in the form of “Implement user story <user story 
number>: <concise rewording of user story>”, e.g. “Implement user story 5: pet sighting reports“.

If the branch is not for a user story, e.g. task, bug fixing, use the form of “<action> <object>”, e.g. “Fix API 
deployment”, “Implement task notifications api call in backend”

### Description:
The description should describe the related user story, if applicable. The description should then document all the 
changes made in that branch.

### Review Process:
The PR will then be reviewed in due time.

If the code is ready to be merged, it will be merged by the maintainers of this repository.
If not, the maintainers will leave comments on the PR. You will be required to reply to the comments with the changes
made if you address these comments. If you disagree with the reviewer’s comment, you can justify your decisions in a 
reply to the comment. The maintainers will then review your new work.



## Notes and Common Issues
* Network error:
  * Stop the server
  * Reset cache by running this command from the `src/frontend/Finding-Neno` directory:
    ```
    npx react-native start --reset-cache
    ```
  * Ensure that the API_URL in `src/frontend/Finding-Neno/.env` is correct
  * Ensure that your phone/tablet device is on the same LAN as the server
  * Run the app again 
* *Blah* module not found:
  * Run the command:
    ```
    pip3 install -r src/backend/requirements.txt
    ```
