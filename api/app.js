const express = require('express');
const AuthRoutes = require('./Routes/auth_routes')
const BlogRoutes = require('./Routes/blog_routes')

const app = express();

const morgan = require('morgan')


app.use(express.json())


//define routes
app.use(morgan('tiny'))
app.use('/auth', AuthRoutes)
app.use('/blog',BlogRoutes)

app.get('/', (req,res) => {
    res.json({message:'Welcome to Blog Api'})
})

app.use((error,req,res,next) => {
    console.log("Error Handling Middleware called")
    console.log('Path',req.path)
    console.log('Error: ',error)

    if (error.type == 'NOT_FOUND') {
        res.status(500).send(error)
    }else if (error.type == 'NOT_FOUND') {
        res.status(404).send(error)
    }else{
        res.status(500).send(error)
    }

    next()
})


module.exports = app;

