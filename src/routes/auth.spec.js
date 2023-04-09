const chai = require('chai')
const chaiHttp = require('chai-http');

const expect = chai.expect
const app = require('../../src/app');

const requester = require('../../requester.spec')

const User = require('../models/user.model');
const Festival = require('../models/festival.schema')() // note we need to call the model caching function
chai.use(chaiHttp);



describe('Authentication API Integration Tests', () => {
    before(async () => {
        // Remove all users before running the tests
        await User.deleteOne({ email: "testuser2@example.com" })
        await User.deleteOne({ email: "testuser3@example.com" })
        await User.deleteOne({ email: "testuser4@example.com" })
    })

    describe('POST /api/signup', () => {
        it('should create a new user', async () => {
            const res = await requester
                .post('/api/signup')
                .send({
                    userName: 'testUser',
                    email: 'testuser2@example.com',
                    password: 'User@12345'
                })

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('error', false)
            expect(res.body).to.have.property('message', 'Account created sucessfully')
        })

        it('should return an error if email already exists', async () => {
            const res = await requester
                .post('/api/signup')
                .send({
                    userName: 'testUser',
                    email: 'testuser@example.com',
                    password: 'Test@12345'
                })

            expect(res).to.have.status(400)
            expect(res.body).to.have.property('error', true)
            expect(res.body).to.have.property('message', 'User with given email already exist')
        })

    })

    describe('POST /api/auth/logIn', () => {
        it('should log in a user and return access and refresh tokens', async () => {
            const res = await requester
                .post('/api/logIn')
                .send({
                    email: 'testuser@example.com',
                    password: 'Test@12345'
                })

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('error', false)
            expect(res.body).to.have.property('accessToken')
            expect(res.body).to.have.property('refreshToken')
            expect(res.body).to.have.property('message', 'Logged in sucessfully')
        })

        it('should return an error if email is invalid', async () => {
            const res = await requester
                .post('/api/logIn')
                .send({
                    email: 'invalidemail@example.com',
                    password: 'password'
                })

            expect(res).to.have.status(401)
            expect(res.body).to.have.property('error', true)
            expect(res.body).to.have.property('message', 'Invalid email or password')
        })

        it('should return an error if password is incorrect', async () => {
            const res = await requester
                .post('/api/logIn')
                .send({
                    email: 'testuser@example.com',
                    password: 'incorrectpassword'
                })

            expect(res).to.have.status(401)
            expect(res.body).to.have.property('error', true)
            expect(res.body).to.have.property('message', 'Invalid email or password')
        })


    })

    describe('system tests', function () {
        it('should create two users and retrieve a list of users', async function () {

            const testUserA = {
                userName: 'testUser',
                email: 'testuser3@example.com',
                password: 'User@12345'
            }
            const testUserB = {
                userName: 'testUser',
                email: 'testuser4@example.com',
                password: 'User@12345'
            }

            const res1 = await requester.post('/api/signup').send(testUserA)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('error', false)
            expect(res1.body).to.have.property('message', 'Account created sucessfully')

            testUserA.id = res1.body.id

            const res2 = await requester.post('/api/signup').send(testUserB)

            expect(res2).to.have.status(201)
            expect(res2.body).to.have.property('error', false)
            expect(res2.body).to.have.property('message', 'Account created sucessfully')

            testUserB.id = res2.body.id

            const res3 = await requester.get('/user')
            expect(res3).to.have.status(200)
            expect(res3.body).to.have.length(4)


        })
    })
})              
