const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const authMiddleware = require('./middleware/authMiddleware')

const app = express()

app.use(authMiddleware)

// ADD
router.post('/', async (req, res) => {
    try {
        const { parent, name: categoryName } = req.body;
        const newCategory = new Category({ name: categoryName, parent });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// UPDATE
router.put('/:categoryId', async (req, res) => {
    try {
        let newCategory
        const { name: categoryName } = req.body;
        const { categoryId } = req.params;
        if (categoryId) {
            newCategory = await Category.updateOne({ _id: categoryId }, { $set: { name: categoryName } })
        }
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


// GET ALL
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().lean();

        // Function to build tree structure
        const buildTree = (categories, parent = null) => {
            const resp = categories
                .filter(category => {
                    return category.parent ? category.parent.toString() === parent : category.parent == parent
                })

            return resp.map(category => {
                const children = buildTree(categories, category._id.toString());
                return { ...category, subCategory: children };
            });
        };

        const categoryTree = buildTree(categories);
        res.json(categoryTree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteCategoryAndChildren = async (categoryId) => {
            const children = await Category.find({ parent: categoryId });
            for (const child of children) {
                await deleteCategoryAndChildren(child._id);
            }
            await Category.findOneAndDelete({ _id: categoryId });
        };

        await deleteCategoryAndChildren(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
