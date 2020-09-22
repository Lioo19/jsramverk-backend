let express = require('express');
let router = express.Router();

// const sqlite3 = require('sqlite3').verbose();
const db = require("../db/database.js");
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

    function status404() {
        return res.status(404).json({
            errors: {
                status: 404,
                source: "/login",
                title: "User not found",
                detail: "User email not found in database"
            }
        });
    }

    db.get("SELECT password FROM users WHERE email = ?",
        email, (err, row) => {
            if (err) {
                return status404();
            }

            if (row === undefined) {
                return status404();
            }
            hash = row.password;
            bcrypt.compare(password, hash, function(err, result) {
                if (err) {
                    return status404();
                }
                if (result) {
                    let payload = { email: email };
                    let token = jwt.sign(payload, secret, { expiresIn: '1h'});

                    return res.json({
                        data: {
                            type: "success",
                            msg: "User successfully logged in",
                            user: email,
                            token: token
                        }
                    });
                }
            });
        }
    );
}




module.exports = router;
