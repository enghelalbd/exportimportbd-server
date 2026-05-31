const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        originCountry: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
        quantity: { type: Number, required: true, min: 0, default: 0 },
        description: { type: String, default: '' },
        category: { type: String, default: 'General' },
        exporterEmail: { type: String, required: true, index: true },
        exporterName: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
