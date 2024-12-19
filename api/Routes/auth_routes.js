const express = require('express')
const routes = express.Router()
const authController = require('../Controllers/auth_controller')

routes.post('/login',authController.login);
routes.post('/sign-up',authController.signUp)


module.exports = routes