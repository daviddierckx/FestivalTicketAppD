
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
        const neoQuery = `
            CREATE (f:Festival {
                id: $id,
                Naam: $Naam
            })
            RETURN f.id AS id
        `;
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


}

module.exports = FestivalCrudController;