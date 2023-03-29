const express = require('express')
const router = express.Router()

const Artiest = require('../models/artiest.schema')() // note we need to call the model caching function
const ArtiestController = require('../controllers/crud')
const ArtiestCrudController = new ArtiestController(Artiest)

const ArtiestenController = require('../controllers/artiest.controller')
const ArtiestenCrudController = new ArtiestenController(Artiest)

const auth = require("../middleware/auth")


// create a artiest
router.post('/', auth, ArtiestCrudController.create)

// get all artiesten
//router.get('/', ArtiestCrudController.getAll)

// get a artiest
router.get('/:id', ArtiestCrudController.getOne)

// update a artiest
router.put('/:id', ArtiestCrudController.update)

// remove a artiest
router.delete('/:id', ArtiestCrudController.delete)


// Definieer de route voor het ophalen van artiesten op basis van verschillende criteria met behulp van aggregate pipeline
// route to get all artiesten
//TODO
router.get('/', async (req, res, next) => {
    try {
        // get query params for sorting and filtering
        const sortField = req.query.sortField || 'Naam';
        const sortOrder = parseInt(req.query.sortOrder) || 1;
        const filter = req.query.filter || '';

        // get all artiesten with sorting and filtering
        const artiesten = await ArtiestenCrudController.getAllArtiesten(sortField, sortOrder, filter);

        // send response with artiesten
        res.json(artiesten);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router