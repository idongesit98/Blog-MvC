const request = require('supertest')
const mongoose = require('mongoose')
const UserModel = require('../Model/user_model')
const app = require('../app')
require('dotenv').config()


jest.setTimeout(20000);

beforeAll(async () => {
    await mongoose.connect(process.env.Mongo_Uri);
    console.log('Connected to MongoDb')
})

afterAll(async () => {  
    //await UserModel.deleteMany()
    await mongoose.connection.close()
})

describe('Auth: Signup', () => {
    
    describe('Auth Api Endpoints', () => {
        it('should signup a user', async () => {
            
            const userData = {
                first_name:'Faridat', 
                last_name:'Sani',
                email:'faridat@gmail.com',
                password:'password123',
                phone_number:'08099104215',
                role:'user'
            }
            const response = await request(app)
            .post('/auth/sign-up')
            .set('content-type','application/json')
            .send(userData)
    
            expect(response.status).toBe(201)
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body).toHaveProperty('message')
            expect(response.body.data).toHaveProperty('user')
            expect(response.body.data.user).toHaveProperty('first_name', 'Faridat')
            expect(response.body.data.user).toHaveProperty('last_name', 'Sani')
            expect(response.body.data.user).toHaveProperty('email', 'faridat@gmail.com')
            expect(response.body.data.user).toHaveProperty('phone_number', 8099104215); 
            expect(response.body.data.user).toHaveProperty('role', 'user')
         });

         it('should return an error for missing fields', async () => {
            const userData = {
                first_name: 'Faridat',
                email:'faridat@gmail.com',
            };

            const response = await request(app)
                .post('/auth/sign-up')
                .send(userData)

              expect(response.status).toBe(500)
              expect(response.body.success).toBe(false)  
         });

         it('should login an existing user', async () => {
            const loginData = {
                email:'faridat@gmail.com',
                password:'password123'
            }

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
            
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true)
                expect(response.body.data).toHaveProperty('token')
         })

         it('should return error for invalid credentials', async () => {
            const loginData = {
                email: 'wrongemail@example.com',
                password:'wrongpassword',
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)

                expect(response.status).toBe(400)
                expect(response.body.success).toBe(false)
                expect(response.body.message).toBe('Invalid Credentials')
         })
        
    })
    
})