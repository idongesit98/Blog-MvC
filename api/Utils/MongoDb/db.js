const mongoose = require('mongoose')
require('dotenv').config()

const mongo_uri = process.env.Mongo_Uri;

//connect to MongoDb
function connectToMongoDb() {
    mongoose.connect(mongo_uri)
   
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully')
    })

    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB', err)
    })
}

module.exports = {connectToMongoDb};