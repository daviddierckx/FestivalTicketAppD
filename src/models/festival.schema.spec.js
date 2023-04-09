const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Festival = require('./festival.schema')() // note we need to call the model caching function

describe('Festival model', function () {
    describe('unit tests', function () {
        it('should require a name', async () => {
            const festivalData = {
                MaxAantalBezoekers: 1000,
                isUnderage: false,
                Artiesten: [],
                Date: new Date(),
                Price: 50,
            };

            const festival = new Festival(festivalData);
            let err;

            try {
                await festival.validate();
            } catch (error) {
                err = error;
            }

            expect(err.errors.Naam).to.exist;
        });


        it('should require a max number of visitors', async () => {
            const festivalData = {
                Naam: 'Test Festival',
                isUnderage: false,
                Artiesten: [],
                Date: new Date(),
                Price: 50,
            };

            const festival = new Festival(festivalData);
            let err;

            try {
                await festival.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.MaxAantalBezoekers).to.exist;
        });

        it('should require isUnderage field', async () => {
            const festivalData = {
                Naam: 'Test Festival',
                MaxAantalBezoekers: 1000,
                Artiesten: [],
                Date: new Date(),
                Price: 50,
            };

            const festival = new Festival(festivalData);
            let err;

            try {
                await festival.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.isUnderage).to.exist;
        });

        it('should require a date', async () => {
            const festivalData = {
                Naam: 'Test Festival',
                MaxAantalBezoekers: 1000,
                isUnderage: false,
                Artiesten: [],
                Price: 50,
            };

            const festival = new Festival(festivalData);
            let err;

            try {
                await festival.validate();
            } catch (error) {
                err = error;
            }

            expect(err).to.exist;
            expect(err.errors.Date).to.exist;
        });

    })
})