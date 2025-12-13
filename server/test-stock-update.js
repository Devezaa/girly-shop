const http = require('http');

const updateData = JSON.stringify({
    name: "Test Product Stock",
    price: 10,
    stock: 999
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/products/1',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': updateData.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Update Response:", data);

        // Verify by Fetching
        http.get('http://localhost:5001/api/products/1', (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                const product = JSON.parse(data2);
                console.log("VERIFICATION: Stock is now:", product.stock);
            });
        });
    });
});

req.on('error', error => {
    console.error("Error:", error);
});

req.write(updateData);
req.end();
