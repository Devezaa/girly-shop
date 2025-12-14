
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

const productsPath = path.join(__dirname, 'data/products.json');

const newProductsBatch = [
    {
        name: "Hada Labo Koi-Gokujyun UV White Gel SPF50+ PA++++",
        price: 14.50,
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_0_1765706929912.png`,
        publicId: "hada-labo-uv-white-gel",
        category: "Protect",
        rating: 4.8,
        reviews: 24,
        brand: "Hada Labo",
        volume: "90g",
        description: "A multi-functional UV gel that acts as a lotion, beauty serum, emulsion, cream, and mask. Provides strong SPF50+ protection while hydrating the skin with Hyaluronic Acid and Vitamin C.",
        highlights: ["All-in-One Gel", "SPF50+ PA++++", "Lightweight", "Vitamin C Infused"]
    },
    {
        name: "Hada Labo Gokujyun Premium Hydrating Lotion",
        price: 13.80,
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_1_1765706929912.png`,
        publicId: "hada-labo-premium-lotion",
        category: "Treat",
        rating: 4.9,
        reviews: 45,
        brand: "Hada Labo",
        volume: "170ml",
        description: "A rich, essence-like toner containing 5 types of Hyaluronic Acid to deliver intense moisture to the skin. Perfect for dry skin, leaving it supple and soft.",
        highlights: ["5 Types of Hyaluronic Acid", "Intense Hydration", "Alcohol-Free", "Fragrance-Free"]
    },
    {
        name: "Biore UV Aqua Rich Watery Essence SPF50+ PA++++",
        price: 10.50,
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_2_1765706929912.png`,
        publicId: "biore-uv-aqua-rich-essence",
        category: "Protect",
        rating: 4.8,
        reviews: 120,
        brand: "Biore",
        volume: "50g",
        description: "Water-based sunscreen that applies effortlessly like a serum. Features Micro Defense formula to cover uneven skin surfaces. Water resistant yet washes off with soap.",
        highlights: ["Micro Defense Formula", "Watery Texture", "No White Cast", "Hyaluronic Acid"]
    },
    {
        name: "Care:nel Sleeping Lip Care Lime Night Mask",
        price: 8.00,
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_4_1765706929912.png`,
        publicId: "carenel-lime-lip-mask",
        category: "Treat",
        rating: 4.7,
        reviews: 15,
        brand: "Care:nel",
        volume: "5g",
        description: "A sleeping mask for dry, chapped lips. Enriched with Lime and Vitamin C to gently exfoliate and deeply moisturize lips overnight.",
        highlights: ["Overnight Lip Repair", "Vitamin C Rich", "Fresh Lime Scent", "Melt-in Texture"]
    }
];

async function addBatch() {
    try {
        console.log('🚀 Starting Batch Addition...');

        let productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        let maxId = productsData.reduce((max, p) => (p.id > max ? p.id : max), 0);

        for (const item of newProductsBatch) {
            console.log(`\n📤 Processing: ${item.name}`);

            if (!fs.existsSync(item.imagePath)) {
                console.error(`❌ Image not found: ${item.imagePath}`);
                continue;
            }

            // Upload Image
            const uploadResult = await cloudinary.uploader.upload(item.imagePath, {
                folder: 'girly-shop/products',
                public_id: item.publicId,
                overwrite: true
            });
            console.log(`   ✅ Image uploaded: ${uploadResult.secure_url}`);

            // Create Product
            maxId++;
            const newProduct = {
                id: maxId,
                name: item.name,
                price: item.price,
                image: uploadResult.secure_url,
                category: item.category,
                rating: item.rating,
                reviews: item.reviews,
                isNew: true,
                stock: 50,
                brand: item.brand,
                volume: item.volume,
                description: item.description,
                howToUse: ["Apply as directed.", "Suitable for daily use."],
                ingredients: "", // Simplified
                highlights: item.highlights
            };

            productsData.push(newProduct);
            console.log(`   🎉 Added ID: ${maxId}`);
        }

        // Save All
        fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
        console.log('\n✅ Batch completed successfully!');

    } catch (error) {
        console.error('❌ Batch Error:', error);
    }
}

addBatch();
