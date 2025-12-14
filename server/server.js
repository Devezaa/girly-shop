const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db'); // Import DB connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = "girly-shop-secret-key-change-this-in-prod"; // In production, use .env

// 🛡️ Simple In-Memory Rate Limiter (No external deps)
const loginAttempts = new Map();
const rateLimiterMiddleware = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
    const MAX_ATTEMPTS = 5;

    const record = loginAttempts.get(ip);

    if (record) {
        if (now - record.startTime > WINDOW_MS) {
            // Reset window
            loginAttempts.set(ip, { count: 1, startTime: now });
        } else {
            if (record.count >= MAX_ATTEMPTS) {
                return res.status(429).json({
                    success: false,
                    message: "Too many login attempts. Please try again later."
                });
            }
            record.count++;
        }
    } else {
        loginAttempts.set(ip, { count: 1, startTime: now });
    }
    next();
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "https://girly-shop-rlga1zpx5-devezaas-projects.vercel.app",
            "https://girly-shop-eta.vercel.app",
            "https://girly-shop-kskglxcye-devezaas-projects.vercel.app",
            process.env.CLIENT_URL
        ].filter(Boolean),
        methods: ["GET", "POST"]
    }
});

// 🔌 Socket.io Events (Kept same as before)
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_chat', (data) => {
        socket.join(data.room);
        console.log(`User ${socket.id} joined room: ${data.room}`);
    });

    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('edit_message', (data) => {
        io.emit('message_updated', data);
    });

    socket.on('delete_message', (data) => {
        io.emit('message_deleted', data);
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        socket.broadcast.emit("callEnded");
    });
});

// 📁 Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 📸 Multer Config
// 📸 Cloudinary Config
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'girly-shop',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

// 📤 Upload Endpoint
app.post('/api/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("❌ Upload Error Details:", JSON.stringify(err, null, 2));
            console.error("Error Message:", err.message);
            return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        // Cloudinary returns the verified URL in req.file.path
        res.json({ success: true, url: req.file.path });
    });
});

// 🛍️ GET Products (with Search)
app.get('/api/products', async (req, res) => {
    const { search, ids } = req.query;
    try {
        let queryText = 'SELECT * FROM products';
        let queryParams = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push('(name ILIKE $' + (queryParams.length + 1) + ' OR category ILIKE $' + (queryParams.length + 1) + ')');
            queryParams.push(`%${search}%`);
        }

        if (ids) {
            const idList = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            if (idList.length > 0) {
                whereClauses.push(`id = ANY($${queryParams.length + 1})`);
                queryParams.push(idList);
            } else {
                // ids provided but empty or invalid, return empty result if intent was to filter by specific ids
                return res.json([]);
            }
        }

        if (whereClauses.length > 0) {
            queryText += ' WHERE ' + whereClauses.join(' AND ');
        }

        queryText += ' ORDER BY id ASC'; // Consistent ordering

        const result = await db.query(queryText, queryParams);
        // Ensure price is float and images is array (pg handles JSONB to object/array automatically)
        const products = result.rows.map(p => ({
            ...p,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : null,
            rating: parseFloat(p.rating),
            images: p.images || [],
            highlights: p.highlights || [],
            howToUse: p.how_to_use || [],
            isNew: p.is_new
        }));
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 🛍️ GET Single Product
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const p = result.rows[0];
        const product = {
            ...p,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : null,
            rating: parseFloat(p.rating),
            images: p.images || [],
            highlights: p.highlights || [],
            howToUse: p.how_to_use || [],
            isNew: p.is_new
        };
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching product" });
    }
});

// ➕ POST Add Product
app.post('/api/products', async (req, res) => {
    const { name, price, image, category, brand, stock, description, oldPrice, volume, howToUse, ingredients, highlights } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ success: false, message: "Name and Price are required" });
    }
    if (parseFloat(price) < 0) {
        return res.status(400).json({ success: false, message: "Price cannot be negative" });
    }

    try {
        const result = await db.query(`
            INSERT INTO products (name, price, old_price, image, category, brand, stock, volume, description, how_to_use, ingredients, highlights, is_new, rating, reviews)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `, [
            name,
            parseFloat(price),
            oldPrice ? parseFloat(oldPrice) : null,
            image || "/products/anua-bottle.jpg",
            category,
            brand || "Generic",
            stock !== undefined ? parseInt(stock) : 50,
            volume || "",
            description || "",
            JSON.stringify(howToUse || []),
            ingredients || "",
            JSON.stringify(highlights || []),
            true, // isNew
            0, // rating
            0  // reviews
        ]);

        const p = result.rows[0];
        res.json({
            success: true, product: {
                ...p,
                price: parseFloat(p.price),
                oldPrice: p.old_price ? parseFloat(p.old_price) : null,
                rating: parseFloat(p.rating),
                isNew: p.is_new,
                howToUse: p.how_to_use,
                highlights: p.highlights
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// ✏️ PUT Update Product
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, image, category, brand, stock, description, oldPrice, volume, howToUse, ingredients, highlights } = req.body;

    try {
        // Check if exists
        const check = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

        const current = check.rows[0];

        // Prepare values (using COALESCE logic here or in query, easier to prepare values in JS)
        const newName = name !== undefined ? name : current.name;
        const newPrice = price !== undefined ? parseFloat(price) : current.price;
        const newOldPrice = oldPrice !== undefined ? parseFloat(oldPrice) : current.old_price;
        const newImage = image !== undefined ? image : current.image;
        const newCategory = category !== undefined ? category : current.category;
        const newBrand = brand !== undefined ? brand : current.brand;
        const newStock = stock !== undefined ? parseInt(stock) : current.stock;
        const newVolume = volume !== undefined ? volume : current.volume;
        const newDesc = description !== undefined ? description : current.description;
        const newHowToUse = howToUse !== undefined ? JSON.stringify(howToUse) : JSON.stringify(current.how_to_use);
        const newIngredients = ingredients !== undefined ? ingredients : current.ingredients;
        const newHighlights = highlights !== undefined ? JSON.stringify(highlights) : JSON.stringify(current.highlights);

        const result = await db.query(`
            UPDATE products 
            SET name=$1, price=$2, old_price=$3, image=$4, category=$5, brand=$6, stock=$7, volume=$8, description=$9, how_to_use=$10, ingredients=$11, highlights=$12
            WHERE id=$13
            RETURNING *
        `, [newName, newPrice, newOldPrice, newImage, newCategory, newBrand, newStock, newVolume, newDesc, newHowToUse, newIngredients, newHighlights, id]);

        const p = result.rows[0];
        res.json({
            success: true, product: {
                ...p,
                price: parseFloat(p.price),
                oldPrice: p.old_price ? parseFloat(p.old_price) : null,
                rating: parseFloat(p.rating),
                isNew: p.is_new,
                howToUse: p.how_to_use,
                highlights: p.highlights
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
});

// 🗑️ DELETE Product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
});

// 🔐 Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

app.post('/api/auth/login', rateLimiterMiddleware, async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user) {
            let validPassword = false;
            // Legacy handling (assuming migration kept passwords as is)
            if (user.password.length < 50) {
                validPassword = (user.password === password);
            } else {
                validPassword = await bcrypt.compare(password, user.password);
            }

            if (validPassword) {
                const { password: _, ...userInfo } = user;
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
                res.json({ success: true, user: userInfo, token });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error logging in" });
    }
});

// 📝 Register (Secure)
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.query(`
            INSERT INTO users (username, email, password, role, avatar, wishlist)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [
            username,
            email,
            hashedPassword,
            "customer",
            "/user-avatar.jpg",
            JSON.stringify([])
        ]);

        const newUser = result.rows[0];
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, SECRET_KEY, { expiresIn: '7d' });
        const { password: _, ...userInfo } = newUser;

        res.json({ success: true, user: userInfo, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
});

// 👤 Get User Profile
app.get('/api/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // Check permissions
    // Note: ID in DB is integer, req.params.id is string. Comparison needs care.
    if (req.user.id != id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password, ...userInfo } = result.rows[0];
        res.json({ success: true, user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching user" });
    }
});

// 👤 Update User Profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    if (req.user.id != id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { username, email, avatar } = req.body;
    try {
        const check = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

        const current = check.rows[0];
        const newUsername = username || current.username;
        const newEmail = email || current.email;
        const newAvatar = avatar || current.avatar;

        const result = await db.query(`
            UPDATE users SET username=$1, email=$2, avatar=$3 WHERE id=$4 RETURNING *
        `, [newUsername, newEmail, newAvatar, id]);

        const { password, ...userInfo } = result.rows[0];
        res.json({ success: true, user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
});

// 🖼️ GET Banners
app.get('/api/banners', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM banners ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching banners" });
    }
});

// 🖼️ POST Update Banners
app.post('/api/banners', async (req, res) => {
    const banners = req.body;
    if (!Array.isArray(banners)) {
        return res.status(400).json({ success: false, message: "Invalid data format. Expected array." });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM banners'); // Replace all logic

        for (const b of banners) {
            await client.query(`
                INSERT INTO banners (id, src, alt, title, subtitle, btn_text)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [b.id, b.src, b.alt, b.title, b.subtitle, b.btnText]);
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Banners updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating banners" });
    } finally {
        client.release();
    }
});


// 🎟️ GET Vouchers
app.get('/api/vouchers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM vouchers ORDER BY id ASC');
        // CamelCase conversion for frontend compatibility
        const vouchers = result.rows.map(v => ({
            id: v.id,
            code: v.code,
            title: v.title,
            subtitle: v.subtitle,
            discountAmount: parseFloat(v.discount_amount),
            type: v.type,
            displayDiscount: v.display_discount,
            valid: v.valid,
            color: v.color,
            textColor: v.text_color
        }));
        res.json(vouchers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching vouchers" });
    }
});

// 🌟 GET Promotions (Migrated to DB)
app.get('/api/promotions', async (req, res) => {
    try {
        // Fetch from banners table as promotions are now consolidated there
        const result = await db.query('SELECT * FROM banners ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching promotions" });
    }
});


// 🎟️ POST Update Vouchers
app.post('/api/vouchers', async (req, res) => {
    const vouchers = req.body;
    if (!Array.isArray(vouchers)) {
        return res.status(400).json({ success: false, message: "Invalid data format. Expected array." });
    }

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM vouchers'); // Replace all logic

        for (const v of vouchers) {
            await client.query(`
                INSERT INTO vouchers (id, code, title, subtitle, discount_amount, type, display_discount, valid, color, text_color)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [v.id, v.code, v.title, v.subtitle, v.discountAmount, v.type, v.displayDiscount, v.valid, v.color, v.textColor]);
        }

        await client.query('COMMIT');
        res.json({ success: true, message: "Vouchers updated successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating vouchers" });
    } finally {
        client.release();
    }
});

// 🚨 Centralized Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
