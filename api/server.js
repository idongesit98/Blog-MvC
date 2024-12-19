const app = require('./app')
const db = require('./Utils/MongoDb/db')
const PORT = 4000;

db.connectToMongoDb()


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})