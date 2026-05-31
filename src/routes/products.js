const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products?search=&limit=&sort=
router.get('/', async (req, res, next) => {
    try {
        const { search = '', limit, sort = 'recent', exporterEmail } = req.query;
        const query = {};
        if (search) query.name = { $regex: search, $options: 'i' };
        if (exporterEmail) query.exporterEmail = exporterEmail;

        let cursor = Product.find(query);
        if (sort === 'recent') cursor = cursor.sort({ createdAt: -1 });
        if (limit) cursor = cursor.limit(Number(limit));

        const products = await cursor.exec();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

// POST /api/products
router.post('/', async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const update = { ...req.body };
        delete update._id;
        delete update.exporterEmail;
        const product = await Product.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted', id: req.params.id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
