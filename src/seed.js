require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const DUMMY_PRODUCTS = [
    {
        name: 'Premium Arabica Coffee Beans',
        image: 'https://images.unsplash.com/photo-1559525323-cbb5269e4497?w=800',
        price: 24.99,
        originCountry: 'Ethiopia',
        rating: 4.8,
        quantity: 120,
        category: 'Beverages',
        description: 'Hand-picked single-origin Arabica coffee beans from the highlands of Ethiopia. Rich aroma, smooth taste with hints of citrus and chocolate.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
    {
        name: 'Authentic Darjeeling Black Tea',
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800',
        price: 18.5,
        originCountry: 'India',
        rating: 4.6,
        quantity: 80,
        category: 'Beverages',
        description: 'First-flush Darjeeling black tea, prized as the "Champagne of Teas". Delicate muscatel notes and bright golden infusion.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
    {
        name: 'Handwoven Silk Scarf',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
        price: 49.0,
        originCountry: 'Vietnam',
        rating: 4.7,
        quantity: 45,
        category: 'Apparel',
        description: 'Luxurious handwoven mulberry silk scarf with traditional Vietnamese motifs. Lightweight and elegant.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
    {
        name: 'Organic Manuka Honey 500g',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
        price: 65.0,
        originCountry: 'New Zealand',
        rating: 4.9,
        quantity: 60,
        category: 'Food',
        description: 'Pure UMF 10+ Manuka honey, raw and unpasteurized. Known for its unique health properties and rich flavor.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
    {
        name: 'Extra Virgin Olive Oil 1L',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
        price: 29.5,
        originCountry: 'Italy',
        rating: 4.7,
        quantity: 95,
        category: 'Food',
        description: 'Cold-pressed extra virgin olive oil from Tuscany. Smooth, peppery finish, perfect for cooking and dressings.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
    {
        name: 'Argentinian Beef Cuts (Frozen)',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
        price: 89.0,
        originCountry: 'Argentina',
        rating: 4.5,
        quantity: 35,
        category: 'Food',
        description: 'Grass-fed Argentinian beef tenderloin cuts, vacuum-sealed and flash-frozen for export-grade freshness.',
        exporterEmail: 'jane.exports@hub.dev',
        exporterName: 'Jane Exports',
    },
    {
        name: 'Belgian Dark Chocolate Box',
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800',
        price: 34.0,
        originCountry: 'Belgium',
        rating: 4.8,
        quantity: 110,
        category: 'Food',
        description: 'Assorted handcrafted Belgian dark chocolates with 70% cocoa. Made by master chocolatiers in Bruges.',
        exporterEmail: 'jane.exports@hub.dev',
        exporterName: 'Jane Exports',
    },
    {
        name: 'Handmade Moroccan Leather Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        price: 79.0,
        originCountry: 'Morocco',
        rating: 4.6,
        quantity: 28,
        category: 'Apparel',
        description: 'Genuine full-grain leather bag, hand-stitched by artisans in Marrakesh. Vegetable-tanned and naturally finished.',
        exporterEmail: 'jane.exports@hub.dev',
        exporterName: 'Jane Exports',
    },
    {
        name: 'Premium Basmati Rice 5kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
        price: 22.0,
        originCountry: 'Pakistan',
        rating: 4.5,
        quantity: 150,
        category: 'Food',
        description: 'Long-grain aged Basmati rice. Aromatic, fluffy when cooked, and ideal for biryani and pilaf.',
        exporterEmail: 'rajan.foods@hub.dev',
        exporterName: 'Rajan Foods',
    },
    {
        name: 'Japanese Matcha Powder 100g',
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800',
        price: 32.0,
        originCountry: 'Japan',
        rating: 4.9,
        quantity: 70,
        category: 'Beverages',
        description: 'Ceremonial-grade matcha green tea powder from Uji, Kyoto. Vibrant green, smooth, and subtly sweet.',
        exporterEmail: 'rajan.foods@hub.dev',
        exporterName: 'Rajan Foods',
    },
    {
        name: 'Colombian Roasted Coffee 1kg',
        image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=800',
        price: 27.0,
        originCountry: 'Colombia',
        rating: 4.7,
        quantity: 100,
        category: 'Beverages',
        description: 'Medium-roasted Colombian Supremo beans. Balanced acidity, nutty body, and caramel sweetness.',
        exporterEmail: 'rajan.foods@hub.dev',
        exporterName: 'Rajan Foods',
    },
    {
        name: 'Cashmere Wool Shawl',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
        price: 120.0,
        originCountry: 'Nepal',
        rating: 4.8,
        quantity: 25,
        category: 'Apparel',
        description: 'Soft, lightweight 100% pure cashmere shawl, hand-loomed in the Himalayan foothills.',
        exporterEmail: 'demo.exporter@hub.dev',
        exporterName: 'Demo Exporter',
    },
];

async function seedIfEmpty() {
    const count = await Product.countDocuments();
    if (count > 0) {
        console.log(`[seed] Skipped — ${count} products already exist.`);
        return;
    }
    await Product.insertMany(DUMMY_PRODUCTS);
    console.log(`[seed] Inserted ${DUMMY_PRODUCTS.length} dummy products.`);
}

async function runSeedCli() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/import_export_hub';
    await mongoose.connect(uri);
    await Product.deleteMany({});
    await Product.insertMany(DUMMY_PRODUCTS);
    console.log(`[seed] Reset and inserted ${DUMMY_PRODUCTS.length} dummy products.`);
    await mongoose.disconnect();
}

if (require.main === module) {
    runSeedCli().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}

module.exports = { seedIfEmpty, DUMMY_PRODUCTS };
