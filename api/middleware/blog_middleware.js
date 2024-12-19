const Joi = require('joi')

const validateCreatePost = async (req,res,next) => {
    const bodyOfRequest = req.body
    const schema = Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        body:Joi.string().required(),
        author:Joi.string().required(),
        tags:Joi.string().required(),
        state:Joi.string().required()

    })

    const valid = await schema.validate(bodyOfRequest);
    console.log({valid})

    if (valid.error) {
        return res.status(422).json({
            message:valid.error.message
        })
    }

    next()
}

module.exports = {validateCreatePost}