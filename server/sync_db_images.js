require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const fs = require('fs');
const path = require('path');
const db = require('./db');

const BANNERS_PATH = path.join(__dirname, 'data/banners.json');
const PRODUCTS_PATH = path.join(__dirname, 'data/products.json');

async function syncBanners() {
    console.log('\n--- Syncing Banners to DB ---');
    if (!fs.existsSync(BANNERS_PATH)) {
        console.error('Banners file not found');
        return;
    }

    const banners = JSON.parse(fs.readFileSync(BANNERS_PATH, 'utf8'));
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        // We will simple update existing banners by ID or Title, OR clear and re-insert.
        // Given this is a "sync" and the JSON is the source of truth for migration:
        // Let's clear and re-insert to ensure exact match.
        await client.query('DELETE FROM banners');

        for (const b of banners) {
            await client.query(`
                INSERT INTO banners (id, src, alt, title, subtitle, btn_text)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [b.id, b.src, b.alt || '', b.title, b.subtitle, b.btnText]);
        }
        await client.query('COMMIT');
        console.log('✅ Banners synced successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error syncing banners:', err);
    } finally {
        client.release();
    }
}

async function syncProducts() {
    console.log('\n--- Syncing Product Images to DB ---');
    if (!fs.existsSync(PRODUCTS_PATH)) {
        console.error('Products file not found');
        return;
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

    // For products, we don't want to delete/re-insert because of orders/relations (if any).
    // We will UPDATE images where name matches.

    let updatedCount = 0;
    for (const p of products) {
        try {
            // Update image URL based on product name (assuming names are unique/consistent)
            // Or better, if ID is preserved. Let's try ID first if it matches DB type (integer).

            // Check if ID is integer
            if (Number.isInteger(p.id)) {
                const res = await db.query(`
                    UPDATE products SET image = $1 WHERE id = $2 RETURNING id
                `, [p.image, p.id]);
                if (res.rowCount > 0) updatedCount++;
            } else {
                // Fallback to name match for new items or string IDs
                const res = await db.query(`
                    UPDATE products SET image = $1 WHERE name = $2 RETURNING id
                `, [p.image, p.name]);
                if (res.rowCount > 0) updatedCount++;
            }
        } catch (err) {
            console.error(`Failed to update product ${p.name}:`, err.message);
        }
    }
    console.log(`✅ Updated images for ${updatedCount} products.`);
}

async function main() {
    try {
        await syncBanners();
        await syncProducts();
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        // Close pool to exit script
        // db.pool.end() might hang if db module exports pool directly.
        // Assuming db.js exports pool or query.
        process.exit();
    }
}

main();
