const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

const ArtiestSchema = new Schema({
    Naam: {
        type: String,
        required: true
    },
    Genre: {
        type: String,
        required: true
    },
    ImageUrl: {
        type: String
    }
})



module.exports = getModel('Artiest', ArtiestSchema)
