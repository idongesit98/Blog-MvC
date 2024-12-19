const jwt = require('jsonwebtoken')
const UserModel = require('../Model/user_model')

const validateToken = async(req,res,next) => {
    try {
        let bearerToken = req.headers.authorization;

        if(!bearerToken){
            req.user = null;
            return next();
        }
        bearerToken = bearerToken.split(' ')[1]
        if (!bearerToken) {
            return res.status(403).json({ //do you use json or render
                message:'Unauthorized: No token provided'
            })
        }

        let validToken;
        try {
            validToken = jwt.verify(bearerToken, process.env.JWT_SECRET)
        } catch (error) {
            //Handling jwt token errors
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message:"Token expired. Please log in again"
                });
            }

            return res.status(403).json({
                message:'Unauthorized: Invalid token'
            });       
        }
            const user = await UserModel.findOne({email:validToken.email})
            if (!user) {
                return res.status(403).json({
                    message:'Unauthorized'
                })
            }
            req.user = user
            next()
    } catch (error) {
        //other errors
        return res.status(500).json({
            message:'Internal server error',
            error:error.message
        })
    }  
}

module.exports = {validateToken}