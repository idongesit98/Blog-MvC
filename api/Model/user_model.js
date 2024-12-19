const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
    {
        first_name:{
            type:String,
            required:[true, "Please enter your first name"]
        },
        last_name:{
            type:String,
            required:[true, "Please enter your last name"],
        },
        password:{
            type:String,
            required:[true]
        },
        email:{
            type:String,
            required:[true,"Please enter an email address"]
        },
        phone_number:{
            type:Number,
            required:true,
            default:0
        },
        role:{
            type:String,
            enum:['admin', 'user'],
            default:'user'
        },
        created_at:{
            type:Date
        }
    }
);

UserSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password,10);
        this.password = hash;
        next()   
    }
)

UserSchema.methods.isValidPassword = async function (password) {
    const user  = this;
    const compare = await bcrypt.compare(password,user.password)
    return compare
}

const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel