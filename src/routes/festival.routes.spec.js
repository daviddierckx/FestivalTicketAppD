const chai = require('chai')
const chaiHttp = require('chai-http');

const expect = chai.expect
const app = require('../../src/app');

const requester = require('../../requester.spec')

const User = require('../models/user.model');
const Festival = require('../models/festival.schema')() // note we need to call the model caching function
chai.use(chaiHttp);

describe('Festival endpoints', function () {

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


    describe('integration tests', function () {

        describe('Festival Router', () => {
            it('should create a festival', async () => {

                const testFestival = {
                    Naam: "Test festival",
                    MaxAantalBezoekers: 20,
                    Artiesten: [
                        {
                            Naam: "Gunna",
                            Genre: "Rap"
                        },
                        {
                            Naam: "Billie Eilish",
                            Genre: "Pop"
                        }
                    ],
                    isUnderage: true,
                    Date: "2022-01-09T00:00:00.000Z",
                    Price: 39.43
                }

                const res = await requester
                    .post('/festivals')
                    .send(testFestival);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id');

                id = res.body.id

                const festival = await Festival.findOne({ Naam: testFestival.Naam })


                expect(festival).to.have.property('Naam', testFestival.Naam)
                expect(festival).to.have.property('MaxAantalBezoekers', testFestival.MaxAantalBezoekers)


            });

            it('should get all festivals', async () => {
                const res = await requester.get('/festivals');
                expect(res).to.have.status(200)
                expect(res.body.length).to.be.greaterThan(0);
            });

            it('should get a festival', async () => {
                const festival = await Festival.findOne();
                const res = await requester.get(`/festivals/${festival._id}`);
                expect(res).to.have.status(200)
                expect(res.body.Naam).to.be.equal(festival.Naam);
            });

            it('should update a festival', async () => {
                const festival = await Festival.findOne();
                const res = await requester
                    .put(`/festivals/${festival._id}`)
                    .send({
                        Naam: "Updated Festival",
                        MaxAantalBezoekers: 20,
                        Artiesten: [
                            {
                                Naam: "Gunna",
                                Genre: "Rap"
                            },
                            {
                                Naam: "Billie Eilish",
                                Genre: "Pop"
                            }
                        ],
                        isUnderage: true,
                        Date: "2022-01-09T00:00:00.000Z",
                        Price: 39.43
                    });
                expect(res).to.have.status(204);

            });



            it('should get festivals before a certain date', async () => {
                const res = await requester.get('/festivals/date/before?date=2023-04-01');
                expect(res).to.have.status(200);
                expect(res.body.length).to.be.greaterThan(0);
            });

            it('should get festivals after a certain date', async () => {
                const res = await requester.get('/festivals/date/after?date=2021-04-01');
                expect(res).to.have.status(200);
                expect(res.body.length).to.be.greaterThan(0);
            });

            it('should get festivals within a date range', async () => {
                const res = await requester
                    .get('/festivals/date/range?start=2021-03-01&end=2023-04-30');
                expect(res).to.have.status(200);
                expect(res.body.length).to.be.greaterThan(0);
            });

            it('should remove a festival', async () => {
                const festival = await Festival.findOne();
                const res = await requester.delete(`/festivals/${festival._id}`);

                expect(res).to.have.status(204);
                const deletedFestival = await Festival.findById(festival._id);
                expect(deletedFestival).to.be.null;
            });
        });
        describe('system tests', function () {
            it('should create and retrieve a festivals', async function () {
                const testFestival = {
                    Naam: "Test festival",
                    MaxAantalBezoekers: 20,
                    Artiesten: [
                        {
                            Naam: "Gunna",
                            Genre: "Rap"
                        },
                        {
                            Naam: "Billie Eilish",
                            Genre: "Pop"
                        }
                    ],
                    isUnderage: true,
                    Date: "2022-01-09T00:00:00.000Z",
                    Price: 39.43
                }

                const res1 = await requester.post('/festivals').set('x-access-token', authToken).send(testFestival)
                expect(res1).to.have.status(201)
                expect(res1.body).to.have.property('id')

                const id = res1.body.id
                const res2 = await requester.get(`/festivals/${id}`)

                expect(res2).to.have.status(200)
                expect(res2.body).to.have.property('_id', id)
                expect(res2.body).to.have.property('Naam', testFestival.Naam)
                expect(res2.body).to.have.property('isUnderage', testFestival.isUnderage)
                expect(res2.body).to.have.property('Price', testFestival.Price)

            })
        })
    })
})

