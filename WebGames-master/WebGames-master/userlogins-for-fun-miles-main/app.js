userbase.init({ appId: '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc' }); // Replace with your Userbase app ID

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    try {
        await userbase.signUp({ username, password });
        alert('Signup successful!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        await userbase.signIn({ username, password });
        alert('Login successful!');

        // Save cookies to browser after login
        document.cookie = `username=${username}; path=/`;
        document.cookie = `session=${password}; path=/`;

        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});