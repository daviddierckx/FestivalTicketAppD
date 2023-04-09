const chai = require('chai')
const Artiest = require('./src/models/artiest.schema')() // note we need to call the model caching function
const Festival = require('./src/models/festival.schema')() // note we need to call the model caching function
const Order = require('./src/models/order.schema')() // note we need to call the model caching function
// make chai work with http requests
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const app = require('./src/app')

// export an object that receives test requests
// chai calls 'listen' on the app object
// keepOpen makes sure the app is not closed after a test
let requester = chai.request(app).keepOpen()
module.exports = requester

// close the app after all tests
after(async function () {
    // drop both collections after all test
    await Promise.all([Artiest.deleteMany(), Festival.deleteMany(), Order.deleteMany()])
    requester.close()
})