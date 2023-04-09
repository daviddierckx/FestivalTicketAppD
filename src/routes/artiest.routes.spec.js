const chai = require('chai')
const chaiHttp = require('chai-http');

const expect = chai.expect
const app = require('../../src/app');

const requester = require('../../requester.spec')

const User = require('../models/user.model');
const Artiest = require('../models/artiest.schema')() // note we need to call the model caching function
chai.use(chaiHttp);

describe('Artiest endpoints', function () {

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
        // test POST /artiesten route
        describe('POST /artiesten', () => {
            it('should create a new artiest', async () => {

                const testArtiest = {
                    Naam: 'Test Artiest',
                    Genre: 'Test Genre',
                    ImageUrl: 'test'
                }

                const res = await requester.post('/artiesten').set('x-access-token', authToken).send(testArtiest)

                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id');

                id = res.body.id

                const artiest = await Artiest.findOne({ Naam: testArtiest.Naam })


                expect(artiest).to.have.property('Naam', testArtiest.Naam)
                expect(artiest).to.have.property('Genre', testArtiest.Genre)

                expect(artiest).to.have.property('ImageUrl', testArtiest.ImageUrl)
            });


            it('(POST /artiesten) should not create a artiest with missing name', async function () {
                const testArtiest = {
                    Genre: 'Test Genre',
                    ImageUrl: 'test'
                }

                const res = await requester.post('/artiesten').set('x-access-token', authToken).send(testArtiest)

                expect(res).to.have.status(400)


            })

        });


        describe('PUT /artiesten', () => {
            it('should update a new artiest', async () => {

                const testArtiest = {
                    Naam: 'Test Artiest UPDATED',
                    Genre: 'Test Genre',
                    ImageUrl: 'test'
                }

                const res = await requester.put(`/artiesten/${id}`).set('x-access-token', authToken).send(testArtiest)

                expect(res).to.have.status(204);
                ;

                const artiest = await Artiest.findOne({ Naam: testArtiest.Naam })

                expect(artiest).to.have.property('Naam', testArtiest.Naam)
                expect(artiest).to.have.property('Genre', testArtiest.Genre)
                expect(artiest).to.have.property('ImageUrl', testArtiest.ImageUrl)
            });

        });




        // test GET /artiesten route
        describe('GET /artiesten', () => {
            it('should get all artiesten', async () => {
                const res = await requester.get
                    ('/artiesten')


                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]).to.have.property('Naam');
                expect(res.body[0]).to.have.property('Genre');
                console.log(res.body);

            });
        });

        describe('DELETE /artiesten', () => {
            it('should delete an artiest', async () => {

                const testArtiest = {
                    Naam: 'Test Artiest DELETE',
                    Genre: 'Test Genre',
                    ImageUrl: 'test'
                }

                // create a new artiest
                const res1 = await requester.post('/artiesten').set('x-access-token', authToken).send(testArtiest)

                const id = res1.body.id

                // delete the artiest
                const res2 = await requester.delete(`/artiesten/${id}`).set('x-access-token', authToken)

                expect(res2).to.have.status(204)

                // try to find the deleted artiest
                const artiest = await Artiest.findOne({ _id: id })
                expect(artiest).to.be.null
            });
        });

        describe('system tests', function () {
            it('should create and retrieve a artists', async function () {
                const testArtiest = {
                    Naam: 'Test Artiest',
                    Genre: 'Test Genre',
                    ImageUrl: 'test'
                }


                const res1 = await requester.post('/artiesten').set('x-access-token', authToken).send(testArtiest)
                expect(res1).to.have.status(201)
                expect(res1.body).to.have.property('id')

                const id = res1.body.id
                const res2 = await requester.get(`/artiesten/${id}`)

                expect(res2).to.have.status(200)
                expect(res2.body).to.have.property('_id', id)
                expect(res2.body).to.have.property('Naam', testArtiest.Naam)
                expect(res2.body).to.have.property('Genre', testArtiest.Genre)
                expect(res2.body).to.have.property('ImageUrl', testArtiest.ImageUrl)

            })
        })
    })
})