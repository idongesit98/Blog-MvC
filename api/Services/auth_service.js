const UserModel = require('../Model/user_model')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Login = async({email,password}) => {
    try {
        const user = await UserModel.findOne({email});

        if (!user) {
            return {
                code:400,
                success:false,
                data:null,
                message:'Invalid Credentials'
            }
        }

        const validPassword = await user.isValidPassword(password)

        if (!validPassword) {
            return {
                code:400,
                success:false,
                data:null,
                message:'Invalid Credentials'
            }
        }

        const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1h'})

        return {
            code:200,
            success:true,
            data:{user,token},
            message:'Login Successful'
        }
    } catch (error) {
        return {
            code:500,
            success:false,
            data:null,
            message:error.message || 'Server Error'
        }
    }
}

const SignUp = async({first_name,last_name,password,email,phone_number}) => {
    try {
        const newUser = await UserModel.create({
            first_name,
            last_name,
            password,
            email,
            phone_number
        })

        const token = await jwt.sign({email}, process.env.JWT_SECRET);
        return {
            code:201,
            success:true,
            message: 'user signup successful',
            data:{
                user:newUser,
                token
            }
        }
    } catch (error) {
        return{
            code:500,
            success:false,
            data:null,
            message:error.message
        }
    }
}

module.exports = {Login,SignUp}

