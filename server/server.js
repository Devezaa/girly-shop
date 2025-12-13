const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 5001;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Allow multiple frontend ports
            methods: ["GET", "POST"]
        }
    }
});

// 🔌 Socket.io Events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_chat', (data) => {
        socket.join(data.room);
        console.log(`User ${socket.id} joined room: ${data.room}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast to everyone in the room (including sender if needed, or just others)
        // For simplicity in this demo, broadcasting to everyone
        io.emit('receive_message', data);
    });

    // WebRTC Signaling Events (Video/Voice)
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
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/'))
    },
    filename: function (req, file, cb) {
        // Unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 📤 Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    // Return the URL to the file
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

// 🗄️ Helper to read/write JSON
const getData = (file) => {
    const filePath = path.join(__dirname, 'data', file);
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const saveData = (file, data) => {
    const filePath = path.join(__dirname, 'data', file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 🛍️ GET Products (with Search)
app.get('/api/products', (req, res) => {
    const { search } = req.query;
    let products = getData('products.json');

    if (search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
        );
    }

    res.json(products);
});

// 🛍️ GET Single Product
app.get('/api/products/:id', (req, res) => {
    const products = getData('products.json');
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
});

// ➕ POST Add Product
app.post('/api/products', (req, res) => {
    const { name, price, image, category, brand, stock, description, oldPrice, volume, howToUse, ingredients, highlights } = req.body;

    // Validation
    if (!name || price === undefined) {
        return res.status(400).json({ success: false, message: "Name and Price are required" });
    }
    if (parseFloat(price) < 0) {
        return res.status(400).json({ success: false, message: "Price cannot be negative" });
    }

    const products = getData('products.json');

    // Generate Unique ID (Max ID + 1)
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = {
        id: maxId + 1,
        name,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        image: image || "/products/anua-bottle.jpg", // Default fallback
        category,
        brand: brand || "Generic",
        stock: stock !== undefined ? parseInt(stock) : 50,
        volume: volume || "",
        description: description || "",
        howToUse: howToUse || [],
        ingredients: ingredients || "",
        highlights: highlights || [],
        rating: 0,
        reviews: 0,
        isNew: true
    };

    products.push(newProduct);
    saveData('products.json', products);
    res.json({ success: true, product: newProduct });
});

// ✏️ PUT Update Product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, image, category, brand, stock, description, oldPrice, volume, howToUse, ingredients, highlights } = req.body;
    let products = getData('products.json');
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) return res.status(404).json({ success: false, message: "Product not found" });

    // Validation
    if (price !== undefined && parseFloat(price) < 0) {
        return res.status(400).json({ success: false, message: "Price cannot be negative" });
    }

    const updatedProduct = {
        ...products[index],
        name: name !== undefined ? name : products[index].name,
        price: price !== undefined ? parseFloat(price) : products[index].price,
        oldPrice: oldPrice !== undefined ? parseFloat(oldPrice) : products[index].oldPrice,
        image: image !== undefined ? image : products[index].image,
        category: category !== undefined ? category : products[index].category,
        brand: brand !== undefined ? brand : products[index].brand,
        stock: stock !== undefined ? parseInt(stock) : products[index].stock,
        volume: volume !== undefined ? volume : products[index].volume,
        description: description !== undefined ? description : products[index].description,
        howToUse: howToUse !== undefined ? howToUse : products[index].howToUse,
        ingredients: ingredients !== undefined ? ingredients : products[index].ingredients,
        highlights: highlights !== undefined ? highlights : products[index].highlights
    };

    products[index] = updatedProduct;
    saveData('products.json', products);
    res.json({ success: true, product: updatedProduct });
});

// 🗑️ DELETE Product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    let products = getData('products.json');
    const initialLength = products.length;

    products = products.filter(p => p.id !== parseInt(id));

    if (products.length === initialLength) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    saveData('products.json', products);
    res.json({ success: true, message: "Product deleted successfully" });
});

// 🔐 Login (Mock)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = getData('users.json');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Return user info excluding password
        const { password, ...userInfo } = user;
        res.json({ success: true, user: userInfo });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// 📝 Register (Mock)
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = getData('users.json');

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newUser = {
        id: "u" + (users.length + 1),
        username,
        email,
        password, // In real app, hash this!
        role: "customer",
        avatar: "/user-avatar.jpg",
        wishlist: []
    };

    users.push(newUser);
    saveData('users.json', users);

    const { password: _, ...userInfo } = newUser;
    res.json({ success: true, user: userInfo });
});

// ❤️ User Profile & Wishlist (Mock - fetching u1 for demo)
// 👤 Get User Profile by ID
app.get('/api/users/:id', (req, res) => {
    const users = getData('users.json');
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        const { password, ...userInfo } = user;
        res.json({ success: true, user: userInfo });
    } else {
        res.status(404).json({ success: false, message: "User not found" });
    }
});

// 👤 Update User Profile
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`[PUT] Update request for user: ${id}`);

    const { username, email, avatar } = req.body;
    console.log(`Payload size: ${JSON.stringify(req.body).length} bytes`);
    if (avatar) console.log(`Avatar present (starts with): ${avatar.substring(0, 30)}...`);

    let users = getData('users.json');
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        console.error(`User ${id} not found in database`);
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user but keep existing data like password/wishlist if not provided
    const updatedUser = {
        ...users[index],
        username: username || users[index].username,
        email: email || users[index].email,
        avatar: avatar || users[index].avatar
    };

    users[index] = updatedUser;

    try {
        saveData('users.json', users);
        console.log(`User ${id} updated successfully`);
    } catch (err) {
        console.error("Error saving data:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error during save" });
    }

    // Return user info excluding password
    const { password: _, ...userInfo } = updatedUser;
    res.json({ success: true, user: userInfo });
});

// 🖼️ GET Banners
app.get('/api/banners', (req, res) => {
    const banners = getData('banners.json');
    res.json(banners);
});

// 🖼️ POST Update Banners
app.post('/api/banners', (req, res) => {
    const banners = req.body; // Expecting array of banners
    if (!Array.isArray(banners)) {
        return res.status(400).json({ success: false, message: "Invalid data format. Expected array." });
    }
    saveData('banners.json', banners);
    res.json({ success: true, message: "Banners updated successfully" });
});

// 🎟️ GET Vouchers
app.get('/api/vouchers', (req, res) => {
    const vouchers = getData('vouchers.json');
    res.json(vouchers);
});

// 🎟️ POST Update Vouchers
app.post('/api/vouchers', (req, res) => {
    const vouchers = req.body;
    if (!Array.isArray(vouchers)) {
        return res.status(400).json({ success: false, message: "Invalid data format. Expected array." });
    }
    saveData('vouchers.json', vouchers);
    res.json({ success: true, message: "Vouchers updated successfully" });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
