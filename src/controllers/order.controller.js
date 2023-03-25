
const errors = require("../middleware/errors")

const auth = require("../middleware/auth")

// the schema is supplied by injection
class OrderCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }

    addOrder = async (req, res, next) => {


        console.log(req.body);
        const entity = this.model(req.body)
        if (req.user != undefined) {
            console.log(entity);
            entity.userId = req.user._id
            await entity.save()
            res.status(201).json({ id: entity.id })
        } else {
            res.status(401).json({ error: "order failed, check if you're logged in" })
        }

    }

}
module.exports = OrderCrudController;