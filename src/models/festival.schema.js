const mongoose = require('mongoose');
const ArtiestModelSchema = require('./artiestModel.schema');
const Schema = mongoose.Schema;


const getModel = require('./model_cache')

const FestivalSchema = new Schema({
    Naam: {
        type: String,
        required: [true, 'A Festival needs to have a name.']
    },
    MaxAantalBezoekers: {
        type: Number,
        required: [true, 'A Festival needs to have a MaxAantalBezoekers.']
    },
    isUnderage: {
        type: Boolean,
        required: [true, 'A Festival needs to know if isUnderage.']

    },
    Artiesten: {
        type: [ArtiestModelSchema],
        default: [],
        required: [true, 'A Festival needs Artists.']
    },
    Date: {
        type: Date,
        required: true
    },
    Price: {
        type: Number,
        validate: {
            validator: (Price) => Price > 0,
            message: 'A price needs to be positive.'
        }
    }
})



module.exports = getModel('Festival', FestivalSchema)