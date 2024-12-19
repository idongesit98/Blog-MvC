const AuthService = require('../Services/auth_service')

const signUp = async(req,res) =>{
    const payload = req.body //this contain the username,password,phone number, email

    const signUpResponse = await AuthService.SignUp({
        first_name:payload.first_name,
        last_name:payload.last_name,
        email:payload.email,
        password:payload.password,
        phone_number:payload.phone_number
    })

    res.status(signUpResponse.code).json(signUpResponse)
}

const login = async(req,res) =>{
    const payload = req.body; //password email

    const loginResponse = await AuthService.Login({
        email:payload.email,
        password:payload.password
    })

    res.status(loginResponse.code).json(loginResponse)
}

module.exports = {
    signUp,login
}