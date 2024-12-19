const mongoose = require('mongoose')

const BlogSchema = mongoose.Schema(
    {
        title:{
            type:String
        },
        description:{
            type:String
        },
        body:{
            type:String
        },
        tags:{
            type:String,
            enum:['science','food','medicine','article'],
            default:'article'
        },
        author:{
            type:String
        },
        state:{
            type:String,
            enum:['draft','published'],
            default:"draft"
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        read_count:{
            type:Number
        },
        reading_time:{
            type:Number
        },
        role:{
            type:String,
            default:'user'
        }
    },{
        timestamps:{
            created_at:'created_at',
            updated_at:'updated_at'
        }
    }
);
BlogSchema.index({read_count:1,reading_time:1,created_at:1})

const BlogModel = mongoose.model("blog",BlogSchema)
module.exports = BlogModel