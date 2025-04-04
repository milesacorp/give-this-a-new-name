userbase.init({ appId: '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc' }); // Replace with your Userbase app ID

let cookiesData = []; // Store cookies data locally

async function openDatabase() {
    try {
        await userbase.openDatabase({
            databaseName: 'cookies-database',
            changeHandler: (items) => {
                cookiesData = items;
            }
        });
    } catch (error) {
        console.error('Error opening database:', error);
    }
}

// Save cookies to Userbase
document.getElementById('save-cookies').addEventListener('click', async () => {
    try {
        // Delete old cookies
        for (const item of cookiesData) {
            await userbase.deleteItem({ databaseName: 'cookies-database', itemId: item.itemId });
        }

        // Save new cookies
        const cookies = document.cookie.split('; ').map(cookie => decodeURIComponent(cookie)).join('\n');
        await userbase.insertItem({ databaseName: 'cookies-database', item: { text: cookies } });
        alert('Cookies saved to Userbase successfully!');
    } catch (error) {
        console.error('Error saving cookies:', error);
        alert('Failed to save cookies: ' + error.message);
    }
});

// Load cookies from Userbase
document.getElementById('load-cookies').addEventListener('click', async () => {
    try {
        if (cookiesData.length > 0) {
            const cookies = cookiesData[0].item.text.split('\n');
            cookies.forEach(cookie => {
                document.cookie = encodeURIComponent(cookie.trim());
            });
            alert('Cookies loaded successfully!');
        } else {
            alert('No cookies found in Userbase.');
        }
    } catch (error) {
        console.error('Error loading cookies:', error);
        alert('Failed to load cookies: ' + error.message);
    }
});

// Logout
document.getElementById('logout').addEventListener('click', async () => {
    try {
        await userbase.signOut();
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
});

// Open the database on page load
openDatabase();