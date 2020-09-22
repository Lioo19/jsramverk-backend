/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

chai.use(chaiHttp);

describe('Reports', () => {
    describe('GET /reports/week/1', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports/week/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.reporttext.should.be.a("string");
                    res.body.data.reporttext.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('GET /reports/week/2', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports/week/2")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.reporttext.should.be.a("string");
                    res.body.data.reporttext.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('GET /reports', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.msg.should.be.a("string");
                    res.body.data.msg.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('GET /reports/edit/', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports/edit/2")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.reporttext.should.be.a("string");

                    done();
                });
        });
    });

    // test to see that put failed due to not logged in
    describe('PUT /reports/edit/', () => {
        const putreq = {
            reportId: "2",
            rtext: "H"
        };

        it('500  SAD PATH', (done) => {
            chai.request(server)
                .put("/reports/edit/2")
                .send(putreq)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });
    });

    // test to see that post failed due to not logged in
    describe('PUT /reports', () => {
        const postreq = {
            reportId: "2",
            rtext: "H"
        };

        it('500 SAD PATH', (done) => {
            chai.request(server)
                .post("/reports")
                .send(postreq)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });
    });
});
