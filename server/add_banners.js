
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

const bannersPath = path.join(__dirname, 'data/banners.json');

const newBanners = [
    {
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_0_1765705593498.png`,
        title: "New Makeup Collection",
        subtitle: "Express yourself with our latest vibrant shades.",
        btnText: "Explore Makeup",
        publicId: "banner-new-makeup"
    },
    {
        imagePath: String.raw`C:/Users/ASUS/.gemini/antigravity/brain/1bedac30-b5c2-4a5d-9f07-8210c04f2b4a/uploaded_image_1_1765705593498.png`,
        title: "New Skincare Arrival",
        subtitle: "Hydrate and glow with our premium skincare line.",
        btnText: "Shop Skincare",
        publicId: "banner-new-skincare"
    }
];

async function addBannersBatch() {
    try {
        console.log('🚀 Starting Banner Addition...');

        let bannersData = [];
        if (fs.existsSync(bannersPath)) {
            bannersData = JSON.parse(fs.readFileSync(bannersPath, 'utf8'));
        }

        let maxId = bannersData.reduce((max, b) => (b.id > max ? b.id : max), 0);

        for (const item of newBanners) {
            console.log(`\n📤 Processing Banner: ${item.title}`);

            if (!fs.existsSync(item.imagePath)) {
                console.error(`❌ Image not found: ${item.imagePath}`);
                continue;
            }

            // Upload Image
            const uploadResult = await cloudinary.uploader.upload(item.imagePath, {
                folder: 'girly-shop/banners',
                public_id: item.publicId,
                overwrite: true
            });
            console.log(`   ✅ Image uploaded: ${uploadResult.secure_url}`);

            // Create Banner
            maxId++;
            const newBanner = {
                id: maxId,
                src: uploadResult.secure_url,
                title: item.title,
                subtitle: item.subtitle,
                btnText: item.btnText
            };

            // Add to beginning of array so they show first
            bannersData.unshift(newBanner);
            console.log(`   🎉 Added banner ID: ${maxId}`);
        }

        // Save All
        fs.writeFileSync(bannersPath, JSON.stringify(bannersData, null, 2));
        console.log('\n✅ All banners saved successfully!');

    } catch (error) {
        console.error('❌ Banner Batch Error:', error);
    }
}

addBannersBatch();
