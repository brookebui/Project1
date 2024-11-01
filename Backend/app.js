// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');

const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_app",
    port: 3306
});


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// create
app.post('/signup', (request, response) => {
    const { username, password, firstname, lastname, salary, age } = request.body;
    const sql = "INSERT INTO users (username, password, firstname, lastname, salary, age) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [username, password, firstname, lastname, salary, age], (err, data) => {
        if(err){
            console.error(err);
            return response.status(500).json({ error: "Error creating user" });
        }
        return response.json({ success: true, data: data });
    })
});

app.post('/login', (request, response) => {
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    db.query(sql, [request.body.username, request.body.password], (err, data) => {
        if(err){
            console.error(err);
            return response.status(500).json({ error: "Error during login" });
        }
        if(data.length > 0) {
            const updateSql = "UPDATE users SET signintime = CURRENT_TIMESTAMP WHERE username = ?";
            db.query(updateSql, [request.body.username], (updateErr) => {
                if(updateErr) {
                    console.error(updateErr);
                }
            });
            return response.json({ success: true, user: data[0] });
        } else {
            return response.json({ success: false });
        }
    })
});

app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewName(name);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});




// read 
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/salary/:min/:max', (request, response) => {
    const { min, max } = request.params;
    const db = dbService.getDbServiceInstance();
    
    const result = db.searchUsersBySalary(min, max);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/age/:min/:max', (request, response) => {
    const { min, max } = request.params;
    const db = dbService.getDbServiceInstance();
    
    const result = db.searchUsersByAge(min, max);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/registered-after/:username', (request, response) => {
    const { username } = request.params;
    console.log('\n************************************');
    console.log('REGISTRATION SEARCH ENDPOINT CALLED');
    console.log('Username to search:', username);
    console.log('************************************\n');
    
    if (!username) {
        console.log('No username provided');
        return response.json({ data: [] });
    }
    
    const db = dbService.getDbServiceInstance();
    
    db.searchUsersRegisteredAfter(username)
        .then(data => {
            console.log('\n************************************');
            console.log('SEARCH RESULTS:', data);
            console.log('Number of results:', data ? data.length : 0);
            console.log('************************************\n');
            response.json({data: data || []});
        })
        .catch(err => {
            console.error('\n************************************');
            console.error('SEARCH ERROR:', err);
            console.error('************************************\n');
            response.status(500).json({ error: err.message, data: [] });
        });
});

app.get('/search/never-signed-in', (request, response) => {
    console.log('\n************************************');
    console.log('NEVER SIGNED IN SEARCH ENDPOINT CALLED');
    console.log('************************************\n');
    
    const db = dbService.getDbServiceInstance();
    
    db.searchNeverSignedIn()
        .then(data => {
            console.log('\n************************************');
            console.log('SEARCH RESULTS:', data);
            console.log('Number of results:', data ? data.length : 0);
            console.log('************************************\n');
            response.json({data: data || []});
        })
        .catch(err => {
            console.error('\n************************************');
            console.error('SEARCH ERROR:', err);
            console.error('************************************\n');
            response.status(500).json({ error: err.message, data: [] });
        });
});

app.get('/search/same-register-day/:username', (request, response) => {
    const { username } = request.params;
    console.log('\n************************************');
    console.log('SAME REGISTER DAY SEARCH ENDPOINT CALLED');
    console.log('Username to search:', username);
    console.log('************************************\n');
    
    if (!username) {
        console.log('No username provided');
        return response.json({ data: [] });
    }
    
    const db = dbService.getDbServiceInstance();
    
    db.searchUsersSameRegisterDay(username)
        .then(data => {
            console.log('\n************************************');
            console.log('SEARCH RESULTS:', data);
            console.log('Number of results:', data ? data.length : 0);
            console.log('************************************\n');
            response.json({data: data || []});
        })
        .catch(err => {
            console.error('\n************************************');
            console.error('SEARCH ERROR:', err);
            console.error('************************************\n');
            response.status(500).json({ error: err.message, data: [] });
        });
});

app.get('/search/registered-current-date', (request, response) => {
    console.log('\n************************************');
    console.log('CURRENT DATE REGISTRATIONS SEARCH ENDPOINT CALLED');
    console.log('************************************\n');
    
    const db = dbService.getDbServiceInstance();
    
    db.searchUsersRegisteredCurrentDate()
        .then(data => {
            console.log('\n************************************');
            console.log('SEARCH RESULTS:', data);
            console.log('Number of results:', data ? data.length : 0);
            console.log('************************************\n');
            response.json({data: data || []});
        })
        .catch(err => {
            console.error('\n************************************');
            console.error('SEARCH ERROR:', err);
            console.error('************************************\n');
            response.status(500).json({ error: err.message, data: [] });
        });
});

app.get('/search/:term', (request, response) => {
    const {term} = request.params;
    const db = dbService.getDbServiceInstance();
    
    const result = term === "all" ? db.getAllData() : db.searchUsers(term);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
    console.log("app: update is called");
    const { username, userData } = request.body;
    console.log('Update request:', { username, userData });
    
    const db = dbService.getDbServiceInstance();
    const result = db.updateUserById(username, userData);

    result
    .then(data => response.json({success: true}))
    .catch(err => console.log(err)); 
});

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);