const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const db = require('../db');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

async function uploadImage(filePath) {
    try {
        console.log(`Uploading ${path.basename(filePath)}...`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "girly-shop",
            use_filename: true,
            unique_filename: false
        });
        return result.secure_url;
    } catch (err) {
        console.error(`Failed to upload ${filePath}:`, err.message);
        return null;
    }
}

async function migrate() {
    console.log('--- Starting Cloudinary Migration ---');

    // 1. Get List of Files in uploads
    if (!fs.existsSync(UPLOADS_DIR)) {
        console.log('No uploads directory found.');
        return;
    }

    const files = fs.readdirSync(UPLOADS_DIR);
    console.log(`Found ${files.length} files in uploads directory.`);

    for (const file of files) {
        // Skip hidden files or non-images if necessary
        if (file.startsWith('.')) continue;

        const localPath = path.join(UPLOADS_DIR, file);
        const cloudUrl = await uploadImage(localPath);

        if (cloudUrl) {
            console.log(`✅ Uploaded: ${file} -> ${cloudUrl}`);

            // 2. Update DB Records
            // We search for records that contain the filename
            const filenameRegex = `%${file}%`;

            // Update Products (image)
            const pRes = await db.query(
                `UPDATE products SET image = $1 WHERE image LIKE $2 RETURNING id, name`,
                [cloudUrl, filenameRegex]
            );
            if (pRes.rowCount > 0) {
                console.log(`   Updated ${pRes.rowCount} product(s) (image): ${pRes.rows.map(r => r.name).join(', ')}`);
            }

            // Update Users (avatar)
            const uRes = await db.query(
                `UPDATE users SET avatar = $1 WHERE avatar LIKE $2 RETURNING id, email`,
                [cloudUrl, filenameRegex]
            );
            if (uRes.rowCount > 0) {
                console.log(`   Updated ${uRes.rowCount} user(s) (avatar): ${uRes.rows.map(r => r.email).join(', ')}`);
            }

            // Update Banners (src)
            const bRes = await db.query(
                `UPDATE banners SET src = $1 WHERE src LIKE $2 RETURNING id, title`,
                [cloudUrl, filenameRegex]
            );
            if (bRes.rowCount > 0) {
                console.log(`   Updated ${bRes.rowCount} banner(s): ${bRes.rows.map(r => r.title).join(', ')}`);
            }

            // Also need to handle 'images' array in products (JSONB)
            // This is harder with SQL replace on JSON array strings, but we can try a text-based replace on the JSONB cast to text
            // OR fetch, modify, update. Fetch modify update is safer.

            const pArrayRes = await db.query(`SELECT id, images FROM products`);
            for (const prod of pArrayRes.rows) {
                let images = prod.images;
                if (!Array.isArray(images)) continue;

                let changed = false;
                const newImages = images.map(img => {
                    if (img && img.includes(file)) {
                        changed = true;
                        return cloudUrl;
                    }
                    return img;
                });

                if (changed) {
                    await db.query(`UPDATE products SET images = $1 WHERE id = $2`, [JSON.stringify(newImages), prod.id]);
                    console.log(`   Updated product ${prod.id} images array.`);
                }
            }

        }
    }

    console.log('--- Migration Completed ---');
    process.exit(0);
}

migrate();
