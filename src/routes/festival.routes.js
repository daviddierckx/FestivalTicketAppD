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



module.exports = router