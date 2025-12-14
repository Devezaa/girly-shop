const fs = require('fs');
const path = require('path');

async function verifyCloudinary() {
    console.log('--- Verifying Cloudinary Upload (Native) ---');

    // Use a real image from uploads folder
    const testFilePath = path.join(__dirname, 'uploads', 'angkeadey-1.png');
    if (!fs.existsSync(testFilePath)) {
        console.error("Test file not found:", testFilePath);
        return;
    }

    const fileBuffer = fs.readFileSync(testFilePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('image', blob, 'angkeadey-1.png');

    // We do NOT unlink the file at the end because it's a source file


    try {
        const res = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Upload Response:', data);
            if (data.success && data.url.includes('cloudinary.com')) {
                console.log('[PASS] Upload successful. URL is from Cloudinary.');
                console.log(`       URL: ${data.url}`);
            } else {
                console.log('[FAIL] Upload failed or URL is not from Cloudinary.');
            }
        } else {
            console.log(`[FAIL] Upload status: ${res.status}`);
            const text = await res.text();
            console.log('Response:', text);
        }
    } catch (e) {
        console.error('[FAIL] Error:', e.message);
    }
}

// Wait a bit to ensure server is ready
setTimeout(verifyCloudinary, 1000);
