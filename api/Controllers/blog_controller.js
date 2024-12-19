const BlogService = require("../Services/blog_services")

const CreatePost = async (req,res) => {
    const payload = req.body;
    const user = req.user;
    console.log(user)

    const serviceResponse = await BlogService.createPost({
        title: payload.title,
        description:payload.description,
        body:payload.body,
        tags:payload.tags,
        author:payload.author,
        state:payload.state,
        user,
        role:payload.role
    })

    return res.status(serviceResponse.code).json(serviceResponse)
}

const GetPost = async (req,res) => {
    const postId = req.params.postId

    const serviceResponse = await BlogService.GetPost({
        postId
    })

    return res.status(serviceResponse.code).json(serviceResponse);
}

const GetAllPost = async (req,res) => {
    //const {page = 1,perPage = 20} = req.query;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const state = req.query.state || null;
    const user = req.user || null;
    const author = req.query.author || null;
    const title = req.query.title || null;
    const tags = req.query.tags ? req.query.tags.split(',') : null;
    const sortOrder = req.query.sortOrder || "desc";
    const sortBy = req.query.sortBy || "created_at"
    

    const serviceResponse = await BlogService.GetAllPost({
        page,perPage,user,state,author,title,tags,sortOrder,sortBy
    });

    return res.status(serviceResponse.code).json(serviceResponse)
}

const UpdatePost = async (req,res) => {
    const postId = req.params.postId //extract the post id from the url parameters
    const user = req.user //extract the logged in user from the request

    const {title, content, author, state} = req.body;

    const serviceResponse = await BlogService.UpdatePost({
        postId,user, title, content, author,state
    })

    return res.status(serviceResponse.code).json(serviceResponse)
}

const DeletePost = async (req,res) => {
    const postId = req.params.postId
    const user = req.user

    const serviceResponse = await BlogService.DeletePost({
        postId,user
    })

    return res.status(serviceResponse.code).json(serviceResponse)
}

module.exports = {
    CreatePost,
    GetAllPost,
    GetPost,
    UpdatePost,
    DeletePost
}