const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const port = 1337;

const bodyParser = require("body-parser");

const index = require('./routes/index');
const reports = require('./routes/reports');
const register = require('./routes/register');
const login = require('./routes/login');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//CORS, which enables other clients to save information from our API
app.use(cors());

// don't show the log when it is test
// Morgan works instead of the homemade middleware above.
// if (process.env.NODE_ENV !== 'test') {
//     // use morgan to log at command line
//     app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
// }

app.use('/reports', reports);
app.use('/register', register);
app.use('/login', login);
app.use('/', index);

app.use((req, res, next) => {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});


// Start up server
app.listen(port, () => console.log(`My API listening on port ${port}!`));
