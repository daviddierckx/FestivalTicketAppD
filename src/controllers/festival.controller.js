
const errors = require("../middleware/errors")

// the schema is supplied by injection
class FestivalCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }

}

module.exports = FestivalCrudController;