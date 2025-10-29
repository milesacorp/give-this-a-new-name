
// IMPORTANT: Replace 'YOUR_APP_ID' with your actual Userbase App ID.
// You can find this in your Userbase dashboard.
const APP_ID = '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc'; 

// Initialize Userbase SDK
try {
    userbase.init({ appId: APP_ID });
    console.log('Userbase SDK initialized successfully.');
} catch (e) {
    console.error('Failed to initialize Userbase SDK:', e);
    alert('Failed to initialize Userbase SDK. Check your App ID and console for errors.');
}


// --- DOM Elements ---
const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const forgotPasswordSection = document.getElementById('forgot-password-section');

// Signup form
const signupForm = document.getElementById('signup-form');
const signupUsernameInput = document.getElementById('signup-username');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupMessage = document.getElementById('signup-message');

// Login form
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

// Profile section
const profileUsernameSpan = document.getElementById('profile-username');
const profileUserIdSpan = document.getElementById('profile-userid');
const profileEmailSpan = document.getElementById('profile-email');
const logoutButton = document.getElementById('logout-button');

// Update Profile form
const updateProfileForm = document.getElementById('update-profile-form');
const newEmailInput = document.getElementById('new-email');
const updateProfileMessage = document.getElementById('update-profile-message');

// Forgot password
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotUsernameInput = document.getElementById('forgot-username');
const forgotPasswordMessage = document.getElementById('forgot-password-message');
const backToLoginLink = document.getElementById('back-to-login-link');


// --- Helper Functions ---
function displayMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function clearMessages() {
    [signupMessage, loginMessage, updateProfileMessage, forgotPasswordMessage].forEach(el => {
        el.textContent = '';
        el.className = 'message';
    });
}

function showAuthSection() {
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
    forgotPasswordSection.style.display = 'none';
    clearMessages();
    // Clear form fields
    signupForm.reset();
    loginForm.reset();
    forgotPasswordForm.reset();
}

function showProfileSection(user) {
    authSection.style.display = 'none';
    forgotPasswordSection.style.display = 'none';
    profileSection.style.display = 'block';
    clearMessages();
    profileUsernameSpan.textContent = user.username;
    profileUserIdSpan.textContent = user.userId;
    profileEmailSpan.textContent = user.email || 'N/A'; // 'N/A' if email is not set
    newEmailInput.value = user.email || ''; // Pre-fill with current email
}

function showForgotPasswordSection() {
    authSection.style.display = 'none';
    profileSection.style.display = 'none';
    forgotPasswordSection.style.display = 'block';
    clearMessages();
    forgotPasswordForm.reset();
}

// --- Event Handlers ---

// Check if user is already logged in on page load
userbase.getSession()
    .then(session => {
        if (session.user) {
            console.log('User already logged in:', session.user);
            showProfileSection(session.user);
        } else {
            console.log('No active session.');
            showAuthSection();
        }
    })
    .catch(e => {
        console.error('Error getting session:', e);
        showAuthSection(); // Default to auth section on error
    });

// Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const username = signupUsernameInput.value;
    const password = signupPasswordInput.value;
    const email = signupEmailInput.value || undefined; // Pass undefined if empty for optional email

    try {
        const user = await userbase.signUp({
            username,
            password,
            email, // Email is optional
            profile: {
                // You can add other profile data here if needed
            }
        });
        displayMessage(signupMessage, `Signup successful! Welcome, ${user.username}. You are now logged in.`, 'success');
        showProfileSection(user);
    } catch (e) {
        console.error('Signup failed:', e);
        displayMessage(signupMessage, `Signup failed: ${e.message}`, 'error');
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    try {
        const user = await userbase.signIn({ username, password });
        displayMessage(loginMessage, `Login successful! Welcome, ${user.username}.`, 'success');
        showProfileSection(user);
    } catch (e) {
        console.error('Login failed:', e);
        displayMessage(loginMessage, `Login failed: ${e.message}`, 'error');
    }
});

// Logout
logoutButton.addEventListener('click', async () => {
    clearMessages();
    try {
        await userbase.signOut();
        console.log('Logged out successfully.');
        displayMessage(loginMessage, 'You have been logged out.', 'success');
        showAuthSection();
    } catch (e) {
        console.error('Logout failed:', e);
        displayMessage(updateProfileMessage, `Logout failed: ${e.message}`, 'error');
    }
});

// Update Profile (Email)
updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const newEmail = newEmailInput.value || null; // Userbase expects null to remove email

    try {
        const user = await userbase.updateUser({ email: newEmail });
        displayMessage(updateProfileMessage, 'Profile updated successfully!', 'success');
        showProfileSection(user); // Re-fetch and display updated profile
    } catch (e) {
        console.error('Update profile failed:', e);
        displayMessage(updateProfileMessage, `Update failed: ${e.message}`, 'error');
    }
});

// Forgot Password link
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordSection();
});

// Back to Login link
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAuthSection();
});

// Forgot Password form submission
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();
    const username = forgotUsernameInput.value;

    try {
        await userbase.forgotPassword({ username });
        displayMessage(forgotPasswordMessage, 'A temporary password has been sent to your email address.', 'success');
        forgotPasswordForm.reset();
    } catch (e) {
        console.error('Forgot password failed:', e);
        displayMessage(forgotPasswordMessage, `Forgot password failed: ${e.message}`, 'error');
    }
});

// Listener for session changes (e.g., if a session expires or user logs in/out in another tab)
userbase.onUpdate((session) => {
    if (session.user) {
        console.log('User session updated:', session.user);
        showProfileSection(session.user);
    } else {
        console.log('User session ended.');
        showAuthSection();
    }
});
