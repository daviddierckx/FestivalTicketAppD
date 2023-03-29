const express = require('express')
const router = express.Router()

const Festival = require('../models/festival.schema')()// note we need to call the model caching function
const FestivalController = require('../controllers/crud')
const FestivalNeoControllerr = require('../controllers/festival.controller')

const FestivalCrudController = new FestivalController(Festival)
const FestivalNeoCrudController = new FestivalNeoControllerr(Festival)

const auth = require("../middleware/auth")

// create a festival
router.post('/', FestivalNeoCrudController.createFestival)

// get all festivals
router.get('/', FestivalCrudController.getAll)

// get a festival
router.get('/:id', FestivalCrudController.getOne)

// update a festival
router.put('/:id', FestivalCrudController.update)

// remove a festival
router.delete('/:id', FestivalCrudController.delete)

// Route for getting festivals before a certain date
router.get('/date/before', FestivalNeoCrudController.getFestivalsBeforeDate);

// Route for getting festivals after a certain date
router.get('/date/after', FestivalNeoCrudController.getFestivalsAfterDate);

// Route for getting festivals to range from certain dates
router.get('/date/range', FestivalNeoCrudController.getFestivalsByDateRange);

module.exports = router