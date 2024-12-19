const express = require('express')
const routes = express.Router()
const BlogController = require('../Controllers/blog_controller')
const AuthMiddleware = require('../middleware/auth_middleware')
const BlogMiddleware = require("../middleware/blog_middleware")

//AuthMiddleware.validateToken,
// AuthMiddleware.validateToken,rs
routes.get('/all-posts',AuthMiddleware.validateToken, BlogController.GetAllPost)
routes.post('/create',BlogMiddleware.validateCreatePost, AuthMiddleware.validateToken, BlogController.CreatePost);

routes.get('/:postId', AuthMiddleware.validateToken,BlogController.GetPost);
routes.patch('/update-postr/:postId', AuthMiddleware.validateToken,BlogController.UpdatePost)
routes.delete('/delete-post/:postId',AuthMiddleware.validateToken, BlogController.DeletePost)

module.exports = routes