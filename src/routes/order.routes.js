const express = require('express')
const router = express.Router()

const Order = require('../models/order.schema')()// note we need to call the model caching function
const OrderController = require('../controllers/crud')
const OrderPurschaseControllerCrud = require('../controllers/order.controller')
const OrderCrudController = new OrderController(Order)

const OrderPurschaseController = new OrderPurschaseControllerCrud(Order)

const auth = require("../middleware/auth")


// create a order
router.post('/buy', auth, OrderPurschaseController.addOrder)

// get all orders
router.get('/', OrderCrudController.getAll)

// get a order
router.get('/:id', OrderCrudController.getOne)

// update a order
router.put('/:id', OrderCrudController.update)

// remove a order
router.delete('/:id', OrderCrudController.delete)

module.exports = router