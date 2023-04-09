const chai = require('chai')
const expect = chai.expect
const mongoose = require('mongoose');
const ArtiestModel = require('./artiest.schema')();

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


describe('Artiest model', function () {
    describe('unit tests', function () {
        it('should require a naam', async () => {
            const artiestData = {
                genre: 'Rock',
                imageUrl: 'https://example.com/rockstar.jpg'
            };
            const artiest = new ArtiestModel(artiestData);
            let error = null;
            try {
                await artiest.validate();
            } catch (err) {
                error = err;
            }
            expect(error.errors.Naam).to.exist
        });

        it('should require a genre', async () => {
            const artiestData = {
                Naam: 'Test Artiest',
                ImageUrl: 'https://example.com/test.jpg'
            }
            const artiest = new ArtiestModel(artiestData)
            let error
            try {
                await artiest.validate()
            } catch (e) {
                error = e
            }
            expect(error.errors.Genre).to.exist
        })
    })
})
