const mongoose = require('mongoose')
const Schema = mongoose.Schema

const getModel = require('./model_cache')

const UserSchema = new Schema({
    // a user needs to have a name
    userName: {
        type: String,
        required: [true, 'A user needs to have a firstname.'],
    },

    // users email needs be a email
    //TODO: Add email validation
    email: {
        type: String,
        required: [true, 'A user needs to have a Emailadress'],
        unique: [true, 'A user needs to have a unique Emailadress'],
    },
    password: {
        type: String,
        required: [true, 'A user needs to have a Password'],
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"],
        default: ["user"],
    }
})


// export the user model through a caching function
const User = mongoose.model("User", UserSchema);

module.exports = User;