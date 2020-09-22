/* global it describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();

chai.use(chaiHttp);

describe('GET /', () => {
    it('200 HAPPY PATH', (done) => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.msg.should.be.an("object");
                res.body.data.msg.h2.should.be.a("string");
                res.body.data.msg.h2.length.should.be.above(0);

                done();
            });
    });
});
