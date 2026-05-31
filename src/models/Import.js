const mongoose = require('mongoose');

const importSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productSnapshot: {
            name: String,
            image: String,
            price: Number,
            originCountry: String,
            rating: Number,
        },
        importerEmail: { type: String, required: true, index: true },
        importerName: { type: String, default: '' },
        importedQuantity: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Import', importSchema);
