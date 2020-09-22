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

let token = "";

chai.use(chaiHttp);

describe('report_crud', () => {
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

describe('PUT report', () => {
    const putreq = {
        reportId: "2",
        rtext: "H"
    };

    const postreqfail = {
        reportId: "678",
        rtext: "H"
    };

    it('successful login', (done) => {
        chai.request(server)
            .post("/login")
            .send(user)
            .end((err, res) => {
                res.body.data.should.be.an("object");
                res.text.should.be.a("string");
                res.body.data.should.have.property("token");
                token = res.body.data.token;
                done();
            });
    });

    it('should get 201 for put-req when logged in', (done) => {
        chai.request(server)
            .put("/reports/edit/2")
            .set("x-access-token", token)
            .send(putreq)
            .end((err, res) => {
                res.should.have.status(201);

                done();
            });
    });

    it('should get 500 for post-req when logged in', (done) => {
        chai.request(server)
            .post("/reports")
            .set("x-access-token", token)
            .send(postreqfail)
            .end((err, res) => {
                res.should.have.status(201);

                done();
            });
    });
});
