const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PUBLIC_DIR = path.join(__dirname, '../public');
const BANNERS_PATH = path.join(__dirname, 'data/banners.json');
const PRODUCTS_PATH = path.join(__dirname, 'data/products.json');

async function uploadImage(localPath, folder) {
    // localPath might be "/banners/banner-laneige.jpg"
    // Public file path: "../public/banners/banner-laneige.jpg"

    // Remove leading slash if present for path joining
    const relativePath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
    const fullPath = path.join(PUBLIC_DIR, relativePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ File not found: ${fullPath} (Original: ${localPath})`);
        return null;
    }

    try {
        console.log(`☁️ Uploading: ${relativePath}...`);
        const result = await cloudinary.uploader.upload(fullPath, {
            folder: `girly-shop/${folder}`,
            use_filename: true,
            unique_filename: true
        });
        console.log(`✅ Success: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${relativePath}:`, error);
        return null;
    }
}

async function migrateBanners() {
    console.log('\n--- Migrating Banners ---');
    if (!fs.existsSync(BANNERS_PATH)) {
        console.error('Banners file not found');
        return;
    }

    const banners = JSON.parse(fs.readFileSync(BANNERS_PATH, 'utf8'));
    let updated = false;

    for (let banner of banners) {
        if (banner.src && !banner.src.startsWith('http')) {
            // It's a local path
            const newUrl = await uploadImage(banner.src, 'banners');
            if (newUrl) {
                banner.src = newUrl;
                updated = true;
            }
        }
    }

    if (updated) {
        fs.writeFileSync(BANNERS_PATH, JSON.stringify(banners, null, 2));
        console.log('💾 Updated banners.json');
    } else {
        console.log('No local banners found or updated.');
    }
}

async function migrateProducts() {
    console.log('\n--- Migrating Products ---');
    if (!fs.existsSync(PRODUCTS_PATH)) {
        console.error('Products file not found');
        return;
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
    let updated = false;

    for (let product of products) {
        if (product.image && !product.image.startsWith('http')) {
            // It's a local path
            const newUrl = await uploadImage(product.image, 'products');
            if (newUrl) {
                product.image = newUrl;
                updated = true;
            }
        }
    }

    if (updated) {
        fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
        console.log('💾 Updated products.json');
    } else {
        console.log('No local product images found or updated.');
    }
}

async function migrateUIAssets() {
    console.log('\n--- Migrating UI Assets ---');
    const assets = ['login-premium-products.png', 'user-avatar.jpg'];
    
    for (const asset of assets) {
        const newUrl = await uploadImage(asset, 'ui');
        if (newUrl) {
            console.log(`✨ REPLACE IN CODE: "/${asset}" -> "${newUrl}"`);
        }
    }
}

async function main() {
    await migrateBanners();
    await migrateProducts();
    await migrateUIAssets();
    console.log('\n🎉 Migration Complete!');
}

main();
