const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const getModel = require('./model_cache')

const OrderSchema = new Schema({
    OrderNo: {
        type: String,
        unique: [true, 'An order needs to have a unique OrderNo'],
        required: true
    },
    PMethod: {
        type: String,
        required: true
    },
    GTotal: {
        type: Number,
        validate: {
            validator: (GTotal) => GTotal > 0,
            message: ' GTotal needs to be positive.'
        },
        required: true
    },
    Festival: {
        type: String,
        required: true
    },

    Quantity: {
        type: Number,
        validate: {
            validator: (Quantity) => Quantity > 0,
            message: 'Quantity needs to be positive.'
        },
        required: true
    },
    isGift: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user needs to be attached to a order.'],
        ref: 'user'
    },
})




module.exports = getModel('Order', OrderSchema)