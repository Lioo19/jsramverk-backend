let express = require('express');
let router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

let config;

//fetching config-file
try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const secret = config.secret;

//router for post login
router.post("/", (req, res) => {
    login(res, req.body);
});


//entire login function that checks with database
function login(res, body) {
    const email = body.email;
    const password = body.password;
    let hash;

    db.get("SELECT password FROM users WHERE email = ?",
            email, (err, row) => {
                if (err) {
                    status404();
                }

                if (row === undefined) {
                    status404();
                }
                hash = row.password;
                bcrypt.compare(password, hash, function(err, result) {
                    if (err) {
                        console.log(err);
                        status404();
                    }
                    if (result) {
                        let payload = { email: email }
                        let token = jwt.sign(payload, secret, { expiresIn: '1h'});
                        return res.json({
                            data: {
                                type: "success",
                                msg: "User successfully logged in",
                                user: email,
                                token: token
                            }
                        })
                    }
                });
            }
    );
}

function status404() {
    return res.status(401).json({
        errors: {
            status: 401,
            source: "/login",
            title: "User not found",
            detail: "User email not found in database"
        }
    });
}


module.exports = router;
