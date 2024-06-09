const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const authRoutes = require('../routes/authentication');
const bcrypt = require('bcryptjs')

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
    const mongoURI = 'mongodb://localhost:27017/mern-app-test';
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    it('should return error if registration fails', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                password: 'password123',
            });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('status', 'error');
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
        });
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('user');
    });

    it('should return error for invalid login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('status', 'error');
        expect(res.body).toHaveProperty('error', 'Invalid login!');
    });

    it('should return error for incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'error');
        expect(res.body).toHaveProperty('user', false);
    });
});
