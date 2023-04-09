const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose');

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Order = require('./order.schema')() // note we need to call the model caching function

describe('Order model', function () {
    describe('unit tests', function () {
        it('should require a payment method', async () => {
            const orderData = {
                OrderNo: '123',
                GTotal: 100,
                Festival: 'Test Festival',
                Quantity: 2,
                isGift: false,
                userId: mongoose.Types.ObjectId(),
            };

            const order = new Order(orderData);
            let err;

            try {
                await order.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.PMethod).to.exist;
        });

        it('should require a total greater than 0', async () => {
            const orderData = {
                OrderNo: '123',
                PMethod: 'cash',
                GTotal: 0,
                Festival: 'Test Festival',
                Quantity: 2,
                isGift: false,
                userId: mongoose.Types.ObjectId(),
            };

            const order = new Order(orderData);
            let err;

            try {
                await order.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.GTotal).to.exist;
        });

        it('should require a festival', async () => {
            const orderData = {
                OrderNo: '123',
                PMethod: 'cash',
                GTotal: 100,
                Quantity: 2,
                isGift: false,
                userId: mongoose.Types.ObjectId(),
            };

            const order = new Order(orderData);
            let err;

            try {
                await order.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.Festival).to.exist;
        });

        it('should require a quantity greater than 0', async () => {
            const orderData = {
                OrderNo: '123',
                PMethod: 'cash',
                GTotal: 100,
                Festival: 'Test Festival',
                Quantity: 0,
                isGift: false,
                userId: mongoose.Types.ObjectId(),
            };

            const order = new Order(orderData);
            let err;

            try {
                await order.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist
            expect(err.errors.Quantity).to.exist;

        })

        it('should require a user', async () => {
            const orderData = {
                OrderNo: '123',
                PMethod: 'cash',
                GTotal: 100,
                Festival: 'Test Festival',
                Quantity: 2,
                isGift: false,
            };
            const order = new Order(orderData);
            let err;

            try {
                await order.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.userId).to.exist;
        });
    })
})