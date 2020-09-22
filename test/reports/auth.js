/* global describe it before exec */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

const db = require("../../db/database.js");

const user = {
    email: "test@test.test",
    password: "password"
};

const userfail = {
    email: "jghkfj"
};

const userfail2 = {
    email: "jghkfj",
    "password": "jfdglsdkjf"
};

chai.use(chaiHttp);

describe('auth', () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM users", (err) => {
                if (err) {
                    console.error("Could not empty test DB table orders", err.message);
                }

                exec(
                    'sqlite3 v2/db/test.sqlite',
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error(error.message);
                            return;
                        }

                        if (stderr) {
                            console.error(stderr);
                            return;
                        }

                        resolve();
                    });
            });
        });
    });
});

describe('POST /register', () => {
    it('201 HAPPY PATH registration', (done) => {
        chai.request(server)
            .post("/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('500 SAD PATH failed create register', (done) => {
        chai.request(server)
            .post("/register")
            .send(userfail)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it('successful login', (done) => {
        chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.body.data.should.be.an("object");
                res.text.should.be.a("string");
                done();
            });
    });

    it('failed login', (done) => {
        chai.request(server)
            .post("/login")
            .send(userfail2)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
