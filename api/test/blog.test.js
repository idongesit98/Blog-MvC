const request = require('supertest')
const mongoose = require('mongoose')
const { createPost, GetPost, GetAllPost, UpdatePost, DeletePost } = require('../Services/blog_services')
const app = require('../app')
const BlogModel = require('../Model/blog_model')
require('dotenv').config()

jest.setTimeout(20000)

beforeAll(async () => {
    await mongoose.connect(process.env.Mongo_Uri);
    console.log('Connected to MongoDb')
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Post Endpoints', () => {
    describe('Create,Get all/one, Delete and Update post endpoint', () => {
        it('Should create a new blog post successfully', async () => {
            const user = {_id:new mongoose.Types.ObjectId()}
            const postData = {
                title:'Test Blog',
                description:'Test Description',
                body:'Test Body Content',
                tags:'science',
                author:'John Doe',
                state:'draft',
                role:'user',
                user
            };

            const response = await createPost(postData)
            
            expect(response.code).toBe(201);
            expect(response.success).toBe(true);
            expect(response.message).toBe('Post created successfully');
            expect(response.data.savedPost).toHaveProperty('title','Test Blog');
        })

        it('Should retrieve a single post and increment read count', async () => {
            const postId =  new mongoose.Types.ObjectId()
            const mockPost = {
                _id:postId,
                title:'Mock Title',
                description:'Mock description',
                body:'Mock Content',
                read_count:1,
                user_id:new mongoose.Types.ObjectId()
            };

            jest.spyOn(BlogModel, 'findOneAndUpdate').mockResolvedValueOnce(mockPost)
            
            const response = await GetPost({postId})

            expect(response.code).toBe(200);
            expect(response.success).toBe(true);
            expect(response.data.post).toHaveProperty('title', 'Mock Title');
            expect(BlogModel.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:postId},
                {$inc: {read_count: 1}},
                {new:true}
            )
        });

        it('Should return paginated posts based on filters', async () => {
            const mockPosts = [
                {title:'Post 1', read_count: 5},
                {title: 'Post 2', read_count: 10}
            ];

            jest.spyOn(BlogModel, 'find').mockReturnValueOnce({
                sort: () => ({
                    skip: () => ({
                        limit: () => mockPosts
                    }),
                }),
            });

            jest.spyOn(BlogModel, "countDocuments").mockResolvedValueOnce(2);

            const response = await GetAllPost({page: 1, perPage: 2})
            expect(response.code).toBe(200)
            expect(response.success).toBe(true)
            expect(response.data.posts).toHaveLength(2)
            expect(response.data.totalPosts).toBe(2);
        })

        it('Should update a post if user is authorized', async () => {
            const postId = new mongoose.Types.ObjectId();
            const user = {_id: new mongoose.Types.ObjectId()}
            const mockPost = {
                _id:postId,
                user_id:user._id,
                save:jest.fn()
            };

            jest.spyOn(BlogModel, 'findOne').mockResolvedValueOnce(mockPost);

            const response = await UpdatePost({
                postId,
                user,
                title:"Updated Title"
            });

            expect(response.code).toBe(200);
            expect(response.success).toBe(true)
            expect(mockPost.save).toHaveBeenCalled();
            expect(mockPost.title).toBe("Updated Title")
        });

        it('Should delete a post successfully', async () => {
            const postId = new mongoose.Types.ObjectId();
            const user = {_id:new mongoose.Types.ObjectId()}
            const mockPost = {_id:postId,user_id:user._id, deleteOne: jest.fn()}

            jest.spyOn(BlogModel, 'findOne').mockResolvedValueOnce(mockPost);

            const response = await DeletePost ({user, postId});
            
            expect(response.code).toBe(200);
            expect(response.success).toBe(true);
            expect(mockPost.deleteOne).toHaveBeenCalled();
        })
    })    
})