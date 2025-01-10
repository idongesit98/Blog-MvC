const express = require('express')
const routes = express.Router()
const{upload} = require('../Utils/Cloudinary/config')
const authController = require('../Controllers/auth_controller')


routes.get('/allusers', authController.getAllUsers)
routes.post('/login',authController.login);
routes.post('/sign-up',authController.signUp)
routes.post('/upload/:userId',upload.single('profile_pictures'), authController.uploadProfilePicture)


module.exports = routes