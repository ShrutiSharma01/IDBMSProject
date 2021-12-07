# Blood Donation Database Management System

### Group Details

The LNM Institute of Information Technology.

IDBMS Lab N3 Group Number 1.

Members:
* 20UCS185: Shrey Kalpesh Parikh
* 20UCS189: Shruti Sharma
* 20UCS214: Ujjwal Agrawal
* 20UCS225: Vatsal Prakash Mehta

### Required software

* NodeJS and npm (You can download *recommended install LTS version* it
  from [NodeJS Download](https://nodejs.org/en/download/)).
* MySQL (You can download if from [MySQL Download](https://dev.mysql.com/downloads/installer/)).

### How to Run

* Configure and start the MySQL server.
* cd into this project root directory and run ```npm install```.
* cd into the client directory of the project and run ```npm install```.
* Create a new file named ```.env``` and add your MySQL credentials. For example
    ```
    USER_NAME=vatsal
    PASSWORD=123456
    ```
  Note: USER_NAME and PASSWORD should not be change. Not adding these values might result in application crashing.
* Also add the password for the admin login of the application, in a similar fashion as:
    ```
    ADMIN_PASSWORD=123456
    ```
* In two separate terminals run:
    * First in the root directory of project run ```npm start```.
    * Second in the client directory of the project run ```npm start```.
* Go to http://localhost:3000/ in your browser and use the application.