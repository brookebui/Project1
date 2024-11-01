// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure
/*
console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});
*/

// if you configure directly in this file, there is a security issue, but it will work
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});



connection.connect((err) => {
     if(err){
        console.error(err.message);
     } else {
        console.log('db ' + connection.state);
     }
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM Users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }

   async deleteRowById(username){
         try{
              // use await to call an asynchronous function
              const response = await new Promise((resolve, reject) => 
                  {
                     const query = "DELETE FROM Users WHERE username = ?;";
                     connection.query(query, [username], (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                     });
                  }
               );

               console.log(response);  // for debugging to see the result of select
               return response === 1? true: false;

         }  catch(error){
              console.error(error);
         }
   }

   async updateUserById(username, userData){
      try{
           console.log("dbService: ");
           console.log(username);
           console.log(userData);
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
               {
                  const query = "UPDATE Users SET firstname = ?, lastname = ?, salary = ?, age = ? WHERE username = ?;";
                  connection.query(query, 
                      [userData.firstname, userData.lastname, userData.salary, userData.age, username], 
                      (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                      }
                  );
               }
            );

            // console.log(response);  // for debugging to see the result of select
            return response === 1? true: false;
      }  catch(error){
         console.error(error);
      }
   }

   async searchUsers(searchTerm){
        try{
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = `
                         SELECT * FROM Users  
                         WHERE username LIKE ? 
                         OR firstname LIKE ? 
                         OR lastname LIKE ?
                     `;
                     const searchPattern = `%${searchTerm}%`;
                     connection.query(query, 
                         [searchPattern, searchPattern, searchPattern], 
                         (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                         }
                     );
                  }
             );

             // console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.error(error);
         }
   }

   async updateSignInTime(username) {
      try {
          const response = await new Promise((resolve, reject) => {
              const query = "UPDATE users SET signintime = CURRENT_TIMESTAMP WHERE username = ?;";
              connection.query(query, [username], (err, result) => {
                  if(err) reject(new Error(err.message));
                  else resolve(result.affectedRows);
              });
          });
          return response === 1;
      } catch(error) {
          console.error(error);
      }
   }

   async searchUsersBySalary(minSalary, maxSalary) {
       try {
           const response = await new Promise((resolve, reject) => {
               const query = `
                   SELECT * FROM Users  
                   WHERE salary >= ? AND salary <= ?
               `;
               connection.query(query, 
                   [minSalary, maxSalary], 
                   (err, results) => {
                       if(err) reject(new Error(err.message));
                       else resolve(results);
                   }
               );
           });
           return response;
       } catch(error) {
           console.error(error);
       }
   }

   async searchUsersByAge(minAge, maxAge) {
       try {
           const response = await new Promise((resolve, reject) => {
               const query = `
                   SELECT * FROM Users  
                   WHERE age >= ? AND age <= ?
               `;
               connection.query(query, 
                   [minAge, maxAge], 
                   (err, results) => {
                       if(err) reject(new Error(err.message));
                       else resolve(results);
                   }
               );
           });
           return response;
       } catch(error) {
           console.error(error);
       }
   }

   async searchUsersRegisteredAfter(username) {
       try {
           console.log('\n=== Starting searchUsersRegisteredAfter ===');
           console.log('Input username:', username);

           // First get the reference user's registration date
           const referenceQuery = `
               SELECT username, registerday 
               FROM users 
               WHERE username = ?
           `;

           const referenceUser = await new Promise((resolve, reject) => {
               console.log('Executing reference query:', referenceQuery);
               connection.query(referenceQuery, [username], (err, results) => {
                   if (err) {
                       console.error('Reference query error:', err);
                       reject(err);
                   }
                   console.log('Reference query results:', results);
                   resolve(results);
               });
           });

           if (!referenceUser || referenceUser.length === 0) {
               console.log('Reference user not found');
               return [];
           }

           const referenceDate = referenceUser[0].registerday;
           console.log('Reference date found:', referenceDate);

           // Now get all users who registered after the reference date
           const searchQuery = `
               SELECT * 
               FROM users 
               WHERE registerday > ? 
               AND username != ?
               ORDER BY registerday ASC
           `;

           const response = await new Promise((resolve, reject) => {
               console.log('Executing search query:', searchQuery);
               console.log('Parameters:', [referenceDate, username]);
               
               connection.query(searchQuery, [referenceDate, username], (err, results) => {
                   if (err) {
                       console.error('Search query error:', err);
                       reject(err);
                   }
                   console.log('Search query results:', results);
                   resolve(results);
               });
           });

           console.log('=== Finished searchUsersRegisteredAfter ===\n');
           return response;

       } catch (error) {
           console.error('Error in searchUsersRegisteredAfter:', error);
           return [];
       }
   }

   async searchNeverSignedIn() {
       try {
           console.log('\n=== Starting searchNeverSignedIn ===');
           
           const response = await new Promise((resolve, reject) => {
               const query = `
                   SELECT * 
                   FROM Users 
                   WHERE signintime IS NULL
                   ORDER BY registerday ASC;
               `;
               
               console.log('Executing query:', query);
               connection.query(query, [], (err, results) => {
                   if (err) {
                       console.error('Query error:', err);
                       reject(err);
                   }
                   console.log('Query results:', results);
                   resolve(results);
               });
           });

           console.log('=== Finished searchNeverSignedIn ===\n');
           return response;

       } catch (error) {
           console.error('Error in searchNeverSignedIn:', error);
           return [];
       }
   }

   async searchUsersSameRegisterDay(username) {
       try {
           console.log('\n=== Starting searchUsersSameRegisterDay ===');
           console.log('Input username:', username);

           // First get the reference user's registration date
           const referenceQuery = `
               SELECT username, DATE(registerday) as registerday
               FROM Users 
               WHERE username = ?
           `;

           const referenceUser = await new Promise((resolve, reject) => {
               console.log('Executing reference query:', referenceQuery);
               connection.query(referenceQuery, [username], (err, results) => {
                   if (err) {
                       console.error('Reference query error:', err);
                       reject(err);
                   }
                   console.log('Reference query results:', results);
                   resolve(results);
               });
           });

           if (!referenceUser || referenceUser.length === 0) {
               console.log('Reference user not found');
               return [];
           }

           const referenceDate = referenceUser[0].registerday;
           console.log('Reference date found:', referenceDate);

           // Now get all users who registered on the same day
           const searchQuery = `
               SELECT * 
               FROM Users 
               WHERE DATE(registerday) = DATE(?)
               AND username != ?
               ORDER BY username ASC
           `;

           const response = await new Promise((resolve, reject) => {
               console.log('Executing search query:', searchQuery);
               console.log('Parameters:', [referenceDate, username]);
               
               connection.query(searchQuery, [referenceDate, username], (err, results) => {
                   if (err) {
                       console.error('Search query error:', err);
                       reject(err);
                   }
                   console.log('Search query results:', results);
                   resolve(results);
               });
           });

           console.log('=== Finished searchUsersSameRegisterDay ===\n');
           return response;

       } catch (error) {
           console.error('Error in searchUsersSameRegisterDay:', error);
           return [];
       }
   }

   async searchUsersRegisteredCurrentDate() {
       try {
           console.log('\n=== Starting searchUsersRegisteredCurrentDate ===');
           
           const response = await new Promise((resolve, reject) => {
               const query = `
                   SELECT * 
                   FROM Users 
                   WHERE DATE(registerday) = CURDATE()
                   ORDER BY username ASC;
               `;
               
               console.log('Executing query:', query);
               connection.query(query, [], (err, results) => {
                   if (err) {
                       console.error('Query error:', err);
                       reject(err);
                   }
                   console.log('Query results:', results);
                   resolve(results);
               });
           });

           console.log('=== Finished searchUsersRegisteredCurrentDate ===\n');
           return response;

       } catch (error) {
           console.error('Error in searchUsersRegisteredCurrentDate:', error);
           return [];
       }
   }
}

module.exports = DbService;
