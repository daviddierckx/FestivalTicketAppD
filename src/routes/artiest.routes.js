const express = require('express')
const router = express.Router()

const Artiest = require('../models/artiest.schema')() // note we need to call the model caching function
const ArtiestController = require('../controllers/crud')
const ArtiestCrudController = new ArtiestController(Artiest)

const auth = require("../middleware/auth")


// create a artiest
router.post('/', auth, ArtiestCrudController.create)

// get all artiesten
router.get('/', ArtiestCrudController.getAll)

// get a artiest
router.get('/:id', ArtiestCrudController.getOne)

// update a artiest
router.put('/:id', ArtiestCrudController.update)

// remove a artiest
router.delete('/:id', ArtiestCrudController.delete)

module.exports = router