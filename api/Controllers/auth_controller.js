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

const getAllUsers = async(req,res) =>{
    const allUsersResponse = await AuthService.getAllUsers({})
    res.status(allUsersResponse.code).json(allUsersResponse)
}

const uploadProfilePicture = async (req,res) => {
    const {userId} = req.params;

   try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }

        const profilePictureUrl = req.file.path
        const user = await AuthService.addUserProfilePicture(userId,profilePictureUrl);

        res.status(200).json({
            message:'Profile picture added successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({message:"Server error", error: error.message})
   }
}

module.exports = {
    signUp,login,uploadProfilePicture,getAllUsers
}