const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArtiestModelSchema = new Schema({
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



module.exports = ArtiestModelSchema
