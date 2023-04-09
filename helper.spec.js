// reads the .env file and stores it as environment variables, use for config
require('dotenv').config()

const connect = require('./connect')

const User = require('./src/models/user.model')() // note we need to call the model caching function
const Artiest = require('./src/models/artiest.schema')() // note we need to call the model caching function

const Festival = require('./src/models/festival.schema')() // note we need to call the model caching function

const neo = require('./neo')

// connect to the databases
connect.mongoTest(process.env.MONGO_TEST_DB)
connect.neoTest(process.env.NEO4J_TEST_DB)

beforeEach(async () => {


    // clear neo db before each test
    const session = neo.session()
    await session.run(neo.dropAll)
    await session.close()
});