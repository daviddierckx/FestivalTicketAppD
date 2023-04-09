const chai = require('chai')
const chaiHttp = require('chai-http');

const expect = chai.expect
const app = require('../../src/app');

const requester = require('../../requester.spec')

const User = require('../models/user.model');
const Order = require('../models/order.schema')() // note we need to call the model caching function
chai.use(chaiHttp);


describe('Integration tests', function () {

    let authToken;
    let id;

    // login and get auth token before running tests

    before(async function () {
        // increase the timeout for this hook to 5000ms
        this.timeout(5000);
        try {
            // make login request and get auth token
            const res = await requester.post('/api/login').send({
                email:
                    "testuser@example.com",
                password:
                    "Test@12345"
            });
            authToken = res.body.accessToken;
        } catch (error) {
            console.error(error);
        }
    });


    // Test the POST /buy route
    describe('POST /buy', function () {
        it('should create a new order', async () => {
            const order = {

                OrderNo: "2343242",
                PMethod: "Cash TEST",
                GTotal: 23,
                Festival: "TEST FESTIVAL",
                Quantity: 4,
                isGift: true

            };

            const res = await requester
                .post('/orders/buy')
                .set('x-access-token', authToken)
                .send(order)

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('id');
            id = res.body.id
            console.log("ID = ", id);
        });
    });

    // Test the GET / route
    describe('GET /', function () {
        it('should return all orders', async () => {
            const res = await requester
                .get('/orders')

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('_id');
            expect(res.body[0]).to.have.property('PMethod');
            expect(res.body[0]).to.have.property('Festival');

        });
    });

    // Test the GET /:id route
    describe('GET /:id', function () {
        it('should return a single order', async () => {
            const orderId = id;
            const order = await Order.findOne();

            const res = await requester
                .get(`/orders/${orderId}`)

            expect(res).to.have.status(200);
            expect(res.body.Festival).to.be.equal(order.Festival);

        });
    });

    // Test the PUT /:id route
    describe('PUT /:id', function () {
        it('should update an order', async () => {
            const orderId = id;
            const update = {
                OrderNo: "2343242",
                PMethod: "Cash TEST UPDATE",
                GTotal: 23,
                Festival: "TEST UPDATE",
                Quantity: 4,
                isGift: true
            };

            const res = await requester
                .put(`/orders/${orderId}`)
                .send(update)
            expect(res).to.have.status(204);

        });
    });

    // Test the DELETE /:id route
    describe('DELETE /:id', function () {
        it('should delete an order', async () => {
            const orderId = id;
            const order = await Order.findOne();

            const res = await requester
                .delete(`/orders/${orderId}`)

            expect(res).to.have.status(204);
            const deletedOrder = await Order.findById(order._id);
            expect(deletedOrder).to.be.null;
        });
    });



    describe('system tests', function () {
        it('should create and retrieve a orders', async function () {
            const testOrder = {
                OrderNo: "2343242",
                PMethod: "Cash TEST",
                GTotal: 23,
                Festival: "TEST FESTIVAL",
                Quantity: 4,
                isGift: true

            }

            const res1 = await requester.post('/orders/buy').set('x-access-token', authToken).send(testOrder)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('id')

            const id = res1.body.id
            const res2 = await requester.get(`/orders/${id}`)

            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('Festival', testOrder.Festival)
            expect(res2.body).to.have.property('OrderNo', testOrder.OrderNo)
            expect(res2.body).to.have.property('Quantity', testOrder.Quantity)

        })
    })
});
