
// IMPORTANT: Replace 'YOUR_APP_ID' with your actual Userbase App ID.
// You can find this in your Userbase dashboard.
const APP_ID = '7cd8e25b-723d-4af7-8bdf-ef558bd0dfcc'; 

// Initialize Userbase SDK
try {
    userbase.init({ appId: APP_ID });
    console.log('Userbase SDK initialized successfully on index page.');
} catch (e) {
    console.error('Failed to initialize Userbase SDK on index page:', e);
    alert('Failed to initialize Userbase SDK. Check your App ID and console for errors.');
}

// --- DOM Elements ---
const authSection = document.getElementById('auth-section');
const forgotPasswordSection = document.getElementById('forgot-password-section');
const loggedInActions = document.getElementById('logged-in-actions');

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
const goToProfileButton = document.getElementById('go-to-profile-button');
const logoutButtonMainPage = document.getElementById('logout-button-main-page');


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
    [signupMessage, loginMessage, forgotPasswordMessage].forEach(el => {
        el.textContent = '';
        el.className = 'message';
    });
}

function showAuthSection() {
    authSection.style.display = 'block';
    forgotPasswordSection.style.display = 'none';
    loggedInActions.style.display = 'none'; // Hide logged-in actions
    clearMessages();
    // Clear form fields
    signupForm.reset();
    loginForm.reset();
    forgotPasswordForm.reset();
}

function showLoggedInActions() {
    authSection.style.display = 'block'; // Keep login/signup forms visible for now, but hide them in practice
    loggedInActions.style.display = 'block'; // Show "Go to Profile" and "Logout"
    signupForm.style.display = 'none';
    loginForm.style.display = 'none';
    clearMessages();
}


function showForgotPasswordSection() {
    authSection.style.display = 'none';
    forgotPasswordSection.style.display = 'block';
    clearMessages();
    forgotPasswordForm.reset();
}

// --- Event Handlers ---

// Check if user is already logged in on page load
userbase.getSession()
    .then(session => {
        if (session.user) {
            console.log('User already logged in. Redirecting to profile page.');
            window.location.href = 'profile.html'; // Redirect to profile page
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
            email,
            profile: {
                // You can add other initial profile data here if needed during signup
            }
        });
        displayMessage(signupMessage, `Signup successful! Welcome, ${user.username}. Redirecting to profile...`, 'success');
        setTimeout(() => {
            window.location.href = 'profile.html'; // Redirect after a short delay
        }, 1500);
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
        displayMessage(loginMessage, `Login successful! Welcome, ${user.username}. Redirecting to profile...`, 'success');
        setTimeout(() => {
            window.location.href = 'profile.html'; // Redirect after a short delay
        }, 1500);
    } catch (e) {
        console.error('Login failed:', e);
        displayMessage(loginMessage, `Login failed: ${e.message}`, 'error');
    }
});

// Logout from main page button (if user logs in and then logs out without going to profile)
logoutButtonMainPage.addEventListener('click', async () => {
    clearMessages();
    try {
        await userbase.signOut();
        console.log('Logged out successfully from main page.');
        displayMessage(loginMessage, 'You have been logged out.', 'success');
        showAuthSection();
    } catch (e) {
        console.error('Logout failed:', e);
        displayMessage(loginMessage, `Logout failed: ${e.message}`, 'error');
    }
});


// Go to Profile button
goToProfileButton.addEventListener('click', () => {
    window.location.href = 'profile.html';
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
        console.log('User session updated on index page:', session.user);
        window.location.href = 'profile.html'; // Redirect if session starts in another tab
    } else {
        console.log('User session ended on index page.');
        showAuthSection(); // Show auth forms if session ends
    }
});
