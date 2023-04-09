const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose');
const UserModel = require('./user.model');

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Order = require('./order.schema')() // note we need to call the model caching function

describe('User model', function () {
    describe('unit tests', function () {
        it('should require a user name', async () => {
            const userData = {
                email: 'testuserTEST@example.com',
                password: 'Test@12345',
                roles: ['user'],
            };

            const user = new UserModel(userData);
            let err;

            try {
                await user.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.userName).to.exist;
        });

        it('should require an email', async () => {
            const userData = {
                userName: 'Test User',
                password: 'Test@12345',
                roles: ['user'],
            };

            const user = new UserModel(userData);
            let err;

            try {
                await user.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.email).to.exist;
        });

        it('should require a password', async () => {
            const userData = {
                userName: 'Test User',
                email: 'testuserTEST@example.com',
                roles: ['user'],
            };

            const user = new UserModel(userData);
            let err;

            try {
                await user.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.password).to.exist;
        });



        it('should only allow certain roles', async () => {
            const userData = {
                userName: 'Test User',
                email: 'testuserTEST@example.com',
                password: 'Test@12345',
                roles: ['admin', 'super_admin', 'invalid_role'],
            };

            const user = new UserModel(userData);
            let err;

            try {
                await user.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
        });

    })
})