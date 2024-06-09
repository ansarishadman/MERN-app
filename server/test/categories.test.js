const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/category.model');
const categoryRoutes = require('../routes/categories');

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

beforeAll(async () => {
    const mongoURI = 'mongodb://localhost:27017/mern-app-test';
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await Category.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('POST /api/categories', () => {
    it('should add a new category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({
                name: 'Test Category',
                parent: null
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'Test Category');
        expect(res.body).toHaveProperty('parent', null);
    });

    it('should return error if adding category fails', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
});

describe('PUT /api/categories/:categoryId', () => {
    let category;
    
    beforeEach(async () => {
        category = new Category({ name: 'Original Name', parent: null });
        await category.save();
    });

    it('should update an existing category', async () => {
        const res = await request(app)
            .put(`/api/categories/${category._id}`)
            .send({
                name: 'Updated Name'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('modifiedCount', 1);
    });

    it('should return error if updating category fails', async () => {
        const res = await request(app)
            .put('/api/categories/invalidId')
            .send({
                name: 'Updated Name'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
});

describe('GET /api/categories', () => {
    beforeEach(async () => {
        const parentCategory = new Category({ name: 'Parent Category', parent: null });
        await parentCategory.save();
        const childCategory = new Category({ name: 'Child Category', parent: parentCategory._id });
        await childCategory.save();
    });

    it('should get all categories in a tree structure', async () => {
        const res = await request(app)
            .get('/api/categories');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('name', 'Parent Category');
        expect(res.body[0]).toHaveProperty('subCategory');
        expect(res.body[0].subCategory[0]).toHaveProperty('name', 'Child Category');
    });

    it('should return an empty array if no categories exist', async () => {
        await Category.deleteMany({});
        const res = await request(app)
            .get('/api/categories');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('DELETE /api/categories/:id', () => {
    let category;

    beforeEach(async () => {
        category = new Category({ name: 'Category to Delete', parent: null });
        await category.save();
    });

    it('should delete a category and its children', async () => {
        const res = await request(app)
            .delete(`/api/categories/${category._id}`);

        expect(res.statusCode).toBe(204);

        const foundCategory = await Category.findById(category._id);
        expect(foundCategory).toBeNull();
    });

    it('should return error if deleting category fails', async () => {
        const res = await request(app)
            .delete('/api/categories/invalidId');

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});
