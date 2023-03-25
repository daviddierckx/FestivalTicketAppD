// reads the .env file and stores it as environment variables, use for config
require('dotenv').config()

const connect = require('./connect')


const Order = require('./src/models/order.schema')() // note we need to call the model caching function

const neo = require('./neo')

// connect to the databases
connect.mongo(process.env.MONGO_TEST_DB)
connect.neo(process.env.NEO4J_TEST_DB)

beforeEach(async () => {
    // drop both collections before each test
    await Promise.all([Order.deleteMany()])

    // clear neo db before each test
    const session = neo.session()
    await session.run(neo.dropAll)
    await session.close()
});