const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Import = require('../models/Import');

const router = express.Router();

// GET /api/imports?email=user@x.com
router.get('/', async (req, res, next) => {
    try {
        const { email } = req.query;
        const query = email ? { importerEmail: email } : {};
        const imports = await Import.find(query).sort({ createdAt: -1 });
        res.json(imports);
    } catch (err) {
        next(err);
    }
});

// POST /api/imports
router.post('/', async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { productId, importerEmail, importerName, importedQuantity } = req.body;
        if (!productId || !importerEmail || !importedQuantity) {
            throw new Error('Missing required fields');
        }
        const qty = Number(importedQuantity);
        if (qty < 1) throw new Error('Quantity must be at least 1');

        const product = await Product.findById(productId).session(session);
        if (!product) throw new Error('Product not found');
        if (product.quantity < qty) throw new Error('Imported quantity exceeds available stock');

        product.quantity = product.quantity - qty;
        await product.save({ session });

        const [imp] = await Import.create(
            [
                {
                    productId: product._id,
                    productSnapshot: {
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        originCountry: product.originCountry,
                        rating: product.rating,
                    },
                    importerEmail,
                    importerName: importerName || '',
                    importedQuantity: qty,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        res.status(201).json(imp);
    } catch (err) {
        await session.abortTransaction().catch(() => { });
        // Fallback (single-node Mongo without replica set): retry without transaction
        if (err && /Transaction|replica set|transaction numbers/i.test(err.message || '')) {
            try {
                const { productId, importerEmail, importerName, importedQuantity } = req.body;
                const qty = Number(importedQuantity);
                const product = await Product.findById(productId);
                if (!product) return res.status(404).json({ message: 'Product not found' });
                if (product.quantity < qty)
                    return res.status(400).json({ message: 'Imported quantity exceeds available stock' });
                await Product.updateOne({ _id: product._id }, { $inc: { quantity: -qty } });
                const imp = await Import.create({
                    productId: product._id,
                    productSnapshot: {
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        originCountry: product.originCountry,
                        rating: product.rating,
                    },
                    importerEmail,
                    importerName: importerName || '',
                    importedQuantity: qty,
                });
                return res.status(201).json(imp);
            } catch (e2) {
                return next(e2);
            }
        }
        res.status(400).json({ message: err.message || 'Could not import product' });
    } finally {
        session.endSession();
    }
});

// DELETE /api/imports/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const imp = await Import.findByIdAndDelete(req.params.id);
        if (!imp) return res.status(404).json({ message: 'Import not found' });
        res.json({ message: 'Import removed', id: req.params.id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
