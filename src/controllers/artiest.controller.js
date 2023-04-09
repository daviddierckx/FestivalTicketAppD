

// the schema is supplied by injection
class ArtiestCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }
    //TODO


    async getAllArtiesten(sortField, sortOrder, filter) {
        try {
            const query = {};

            // Filter op basis van de opgegeven filterwaarde
            if (filter) {
                query['$or'] = [
                    { Naam: { $regex: filter, $options: 'i' } },
                    { Genre: { $regex: filter, $options: 'i' } },
                ];
            }

            // Maak het sorteerobject
            const sort = {};
            sort[sortField] = sortOrder;

            // Haal de artiesten op uit de database met de filters en sortering
            const artiesten = await this.model.find(query).sort(sort);

            return artiesten;
        } catch (error) {
            console.log(error);
            throw new Error('Something went wrong trying to retrieve artiesten');
        }
    }
}

module.exports = ArtiestCrudController;