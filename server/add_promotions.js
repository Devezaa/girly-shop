
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

const promosPath = path.join(__dirname, 'data/promotions.json');

const newPromos = [
    {
        title: "Portré: Capture the Moment",
        subtitle: "Blur Texture Tint & Essentials",
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_0_1765708218111.png`,
        publicId: "promo-portre-model",
        type: "campaign"
    },
    {
        title: "Innisfree x Wonyoung: Sun Care",
        subtitle: "Green Tea Hyaluronic Moist Sun Serum",
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_1_1765708218111.png`,
        publicId: "promo-innisfree-sun-serum",
        type: "campaign"
    },
    {
        title: "Brighten Your Day",
        subtitle: "Vitamin C Green Tea Enzyme Brightening Cream",
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_2_1765708218111.png`,
        publicId: "promo-innisfree-vit-c",
        type: "campaign"
    },
    {
        title: "Hydration Powerhouse",
        subtitle: "The New Green Tea Seed Hyaluronic Line",
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_3_1765708218111.png`,
        publicId: "promo-innisfree-green-tea-line",
        type: "campaign"
    }
];

async function addPromos() {
    try {
        console.log('🚀 Starting Promotion Images Addition...');

        let promoData = [];
        if (fs.existsSync(promosPath)) {
            promoData = JSON.parse(fs.readFileSync(promosPath, 'utf8'));
        }

        let maxId = promoData.reduce((max, p) => (p.id > max ? p.id : max), 0);

        for (const item of newPromos) {
            console.log(`\n📤 Processing: ${item.title}`);

            if (!fs.existsSync(item.imagePath)) {
                console.error(`❌ Image not found: ${item.imagePath}`);
                continue;
            }

            // Upload Image
            const uploadResult = await cloudinary.uploader.upload(item.imagePath, {
                folder: 'girly-shop/promotions',
                public_id: item.publicId,
                overwrite: true
            });
            console.log(`   ✅ Image uploaded: ${uploadResult.secure_url}`);

            // Create Promo Entry
            maxId++;
            const newPromo = {
                id: maxId,
                title: item.title,
                subtitle: item.subtitle,
                image: uploadResult.secure_url,
                type: item.type,
                dateAdded: new Date().toISOString()
            };

            promoData.push(newPromo);
            console.log(`   🎉 Added ID: ${maxId}`);
        }

        // Save All
        fs.writeFileSync(promosPath, JSON.stringify(promoData, null, 2));
        console.log('\n✅ Promotion images saved successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

addPromos();
