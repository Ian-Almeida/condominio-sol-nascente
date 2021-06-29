# condominio-sol-nascente

This project was designed as an exam, does not feature any kind of security for data!!!
<br>
Most of the sensitive receive data from registrations are saved in database without encrypting and inside Web's Local Storage for session maintenance.

## Project backend setup
  ```
  cd server
  npm install
  ```
  ## Change database dev environment settings
  ```
  First, MYSQL Connection in sever/database/initDatabase.js 
  line 2

  AND

  MYSQL Connection in sever/database/deps.js 
  line 3
  This time, selecting the database
  ```

  ## Initilialize MYSQL Database with script
  ```
  cd server
  npm run initdb
  ```
## Project frontend setup
  ```
  cd client
  npm install
  ```

  ## Run frontend
  ```
  npm start
  ```

