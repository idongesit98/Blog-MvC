const request = require('supertest')
const app = require('../app')

describe('Home Route', () => {
    it('Should return status true', async () => {
        const response = await request(app).get('/').set('content-type', 'application/json')
        expect(response.status).toBe(200)
        expect(response.body).toEqual({message:"Welcome to Blog Api"})
    })
})