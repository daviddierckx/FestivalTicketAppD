
const errors = require("../middleware/errors")
const neo = require('../../neo')

// the schema is supplied by injection
class FestivalCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }

    createFestival = async (req, res, next) => {

        console.log(req.body);
        const entity = new this.model(req.body);
        console.log(entity);

        // Create a festival node in Neo4j
        const neoQuery = neo.createFestival
        const neoParams = {
            Naam: entity.Naam,
            id: entity.id
        };
        const session = neo.session();
        const neoResult = await session.run(neoQuery, neoParams);
        const neoFestivalId = neoResult.records[0].get('id');

        // Add the Neo4j festival ID to the MongoDB entity
        entity.neoId = neoFestivalId;

        // Save the updated festival entity in MongoDB
        await entity.save();

        res.status(201).json({ id: entity.id });
    }

    // Methode om festivals op te halen op basis van een datumbereik
    getFestivalsByDateRange = async (req, res, next) => {
        const { start, end } = req.query;

        try {
            const festivals = await this.model.find({
                Date: {
                    $lt: new Date(end),
                    $gt: new Date(start)
                }
            });

            res.status(200).json(festivals);
        } catch (error) {
            next(errors.internalServerError(error));
        }
    }

    // Zoekt festivals met een datum voor de opgegeven datum
    getFestivalsBeforeDate = async (req, res, next) => {
        try {
            const { date } = req.query;
            const filter = { Date: { $lt: new Date(date) } };
            const festivals = await this.model.find(filter);
            res.json(festivals);
        } catch (error) {
            next(error);
        }
    }

    // Zoekt festivals met een datum na de opgegeven datum
    getFestivalsAfterDate = async (req, res, next) => {
        try {
            const { date } = req.query;
            const filter = { Date: { $gt: new Date(date) } };
            const festivals = await this.model.find(filter);
            res.json(festivals);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = FestivalCrudController;