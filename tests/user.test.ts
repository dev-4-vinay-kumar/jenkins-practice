import request from 'supertest';
import express from 'express';
import { createUser } from '../src/api/userController';

const app = express();
app.use(express.json())
app.post("/api/v1/user",createUser);

describe('POST /api/v1/user', () => {

    it('should create a new user and return it', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .send({ name: 'John Doe' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
    });

    it('should return 400 if name is missing', async () => {
        const response = await request(app)
            .post('/api/v1/user')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
    });
});
