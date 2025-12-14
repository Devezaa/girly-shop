
require('dotenv').config({ path: './.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const imagePath = String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_1765707451714.png`;
const productsPath = path.join(__dirname, 'data/products.json');

async function addProduct() {
    try {
        console.log('🚀 Starting Product Addition: KLEN Herbal Shampoo & Conditioner...');

        // 1. Upload Image
        console.log(`\n📤 Uploading image...`);
        if (!fs.existsSync(imagePath)) {
            throw new Error('Image file not found!');
        }

        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: 'girly-shop/products',
            public_id: 'klen-herbal-shampoo-conditioner',
            overwrite: true
        });

        console.log(`✅ Image uploaded: ${uploadResult.secure_url}`);

        // 2. Read Products Data
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        // 3. Generate New ID
        const maxId = productsData.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const newId = maxId + 1;

        // 4. Create New Product Object
        const newProduct = {
            id: newId,
            name: "KLEN Herbal Hair Shampoo & Conditioner",
            price: 8.50, // Estimated
            image: uploadResult.secure_url,
            category: "Treat", // Hair Care
            rating: 4.8,
            reviews: 0,
            isNew: true,
            stock: 50,
            brand: "KLEN",
            volume: "Standard",
            description: "Advanced Korean herbal formula hair care range. Available for different hair needs: Anti-Dandruff (Men/Women), Hair Fall Control, Damaged Hair Repair, and Normal Hair maintenance.",
            howToUse: [
                "Apply to wet hair and massage into scalp.",
                "Rinse thoroughly.",
                "Follow with KLEN Conditioner for best results."
            ],
            ingredients: "Korean Ginseng, Herbal Extracts, Keratin, Zinc Pyrithione...",
            highlights: [
                "Korean Herbal Formula",
                "Anti-Dandruff Expert",
                "Hair Fall Control",
                "Scalp Care"
            ]
        };

        // 5. Append and Save
        productsData.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

        console.log(`🎉 Product added successfully with ID: ${newId}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

addProduct();
