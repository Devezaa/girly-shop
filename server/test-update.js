async function testUpdate() {
    try {
        // Node 18+ has native fetch
        const response = await fetch('http://localhost:5000/api/users/u1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: "Ashwin Updated",
                email: "ashwin@gmail.com",
                avatar: "data:image/png;base64,TEST_DATA"
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}

testUpdate();
