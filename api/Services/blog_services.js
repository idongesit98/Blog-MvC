const blogModel = require('../Model/blog_model')
const { calculateReadingTime } = require('../Utils/reading_time')

const createPost = async ({title,description,body,tags,author,state,user,role}) => {
   
    try {
        const reading_time = await calculateReadingTime(body)

        const newPost = await blogModel.create({
            title,
            description,
            body,
            tags,
            author,
            state,
            user_id:user._id,
            read_count:0,
            reading_time,  
            role, 
            created_at: new Date()
        })

        const savedPost = await newPost.save();

          return {
            code:201,
            success:true,
            message:'Post created successfully',
            data:{
                savedPost
            }
        }
    } catch (error) {
        return {
            code:500,
            success:false,
            message:"Error creating blog post",
            error:error.message
        };
    }
}

const GetPost = async({postId}) => {
    try {
        const post = await blogModel.findOneAndUpdate(
            {_id:postId},
            {$inc:{read_count:1}},
            {new:true}
        ).populate({
            path:"user_id",
            select:"first_name last_name email role"
        });

        if (!post) {
            const error = new Error('Post was not found')
            error.type = 'NOT_FOUND';
            throw error
        }

        return {
            code:200,
            success:true,
            message:'Post found',
            data:{
                post
            }
        }
    } catch (error) {
        return {
            code:500,
            success:false,
            message:error.message,
            data: null
        }
    }
}

const GetAllPost = async (
    {page = 1,perPage = 20,user = null, state = null,author = null,title = null,tags = null,sortBy = "created_at", sortOrder = "desc" }) => {
    try {
       
        //calculate the number of document to skip
        const skip = (page - 1) * perPage;

        const query = {}

        //If a logged-in user is specified filter post by that user's ID
        if(user){
            query.user_id = user._id
        }

        if(state && Array.isArray(state)){
            query.state = {$in: state}
        }
        if (author) {
            query.author = {$regex: new RegExp(author,'i')}
        }

        if (title) {
            query.title = {$regex: new RegExp(title, 'i')}
        }

        if(tags && Array.isArray(tags)){
            query.tags = {$in: tags}
        }

        const sortFields = 
        {
             read_count:"read_count",
             reading_time:"reading_time",
             created_at:"created_at",
             updated_at:"updated_at"
        }

        const sortField = sortFields[sortBy] || "created_at" //Default sorting is created at
        const order = sortOrder ==="asc" ? 1 : -1

        
        //fetch paginated posts
        const posts = await blogModel.find(query)
        .sort({[sortField]: order})
        .skip(skip) //skip documents for previous pages
        .limit(perPage); //limit the number of documents per page

        //Get total count of posts for pagination metadata
        const totalPosts = await blogModel.countDocuments(query);

        if (!posts || posts.length === 0 ) {
            return{
                code:404,
                success:false,
                message:"No post available",
                data:null
            };
        }
        return{
            code:200,
            success:true,
            message:"Post available",
            data:{
                posts,
                totalPosts,
                totalPosts:Math.ceil(totalPosts / perPage),
                currentPage: page,
                perPage
            }
        };
    } catch (error) {
        return{
            code:500,
            success:false,
            message:'An error occurred while fetching posts',
            error:error.message
        };
    }
}

const UpdatePost = async ({postId,user, title, author, content, state,role}) => {
    try {
        
        //Find the post by Id
        const post = await blogModel.findOne({_id:postId})

        if (!post) {
            return{
                code:404,
                success:false,
                message:"Post not found",
                data:null
            }
        }

        if (post.user_id.toString() !== user._id.toString()) {
            return {
                code:403,
                success:false,
                message:'Post does not belong to user',
                date:null
            }   
        }
        post.title = title || post.title
        post.author = author || post.author
        post.content = content || post.content
        post.state = state || post.state
        post.role = role || post.role
        post.updated_at = new Date()

        await post.save()

        return{
            code:200,
            success:true,
            message:'Post updated successffully',
            data:{
                post
            }
        }
    } catch (error) {
           return{
            code:500,
            success:false,
            message:"An error occurred while making an update",
            error:error.message
        } 
    }
};

const DeletePost = async ({user,postId}) => {
    const post = await blogModel.findOne({_id:postId, user_id:user._id});

    if(!post){
        return {
            code:404,
            success:false,
            message:'Post not found',
            data:null
        }
    }

    await post.deleteOne({
        _id:postId, user_id:user._id
    })

    return {
        code:200,
        success:true,
        message:'Post deleted successfully',
        data:null
    }
}

module.exports = {
    createPost,
    GetAllPost,
    GetPost,
    UpdatePost,
    DeletePost
}

