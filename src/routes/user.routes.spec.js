const chai = require('chai')
const chaiHttp = require('chai-http');

const expect = chai.expect
const app = require('../../src/app');

const requester = require('../../requester.spec')

const User = require('../models/user.model');
const { createWriteStream } = require('fs');
const Festival = require('../models/festival.schema')() // note we need to call the model caching function
chai.use(chaiHttp);



describe('Integration Tests', () => {

    let id;

    before(async () => {
        // Remove all users before running the tests
        await User.deleteOne({ email: "testuserTEST@example.com" })

    })

    describe('POST /api/signup', () => {
        it('should create a new user', async () => {
            const res = await requester
                .post('/api/signup')
                .send({
                    userName: 'testUser',
                    email: 'testuserTEST@example.com',
                    password: 'User@12345'
                })

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('error', false)
            expect(res.body).to.have.property('message', 'Account created sucessfully')

        })
    })
    describe('GET /user', () => {
        it('should return a list of users', async () => {

            const res = await requester
                .get('/user')

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('email');
            expect(res.body[0]).to.have.property('userName');

        });
    });

    describe('GET /user/:id', () => {
        it('should return a user with the specified id', async () => {
            const user = await User.findOne();
            const userId = user._id;

            const res = await requester
                .get(`/user/${user._id}`)

            expect(res).to.have.status(200);
            expect(res.body.userName).to.be.equal(user.userName);
        });

        it('should return a null if user with the specified id is not found', async () => {
            const response = await requester.get(`/user/123456789012345678901234`);

            expect(response.body).to.be.empty;
        });
    });



})

after(async () => {
    // Remove all users before running the tests
    await User.deleteOne({ email: "testuserTEST@example.com" })

})
