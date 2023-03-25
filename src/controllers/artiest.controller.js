
const errors = require("../errors")

// the schema is supplied by injection
class ArtiestCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }

}

module.exports = ArtiestCrudController;