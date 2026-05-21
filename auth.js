const API_URL = 'https://expense-tracker-api-ybls.onrender.com/api';


// Tab switch
function showTab(tab) {
    document.getElementById('login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register').style.display = tab === 'register' ? 'block' : 'none';

    document.querySelectorAll('.tab').forEach((btn, i) => {
        btn.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
    });

    const bottomLink = document.getElementById('bottom-link');
    if (tab === 'login') {
        bottomLink.innerHTML = 'Don\'t have an account? <span style="color:#1565c0; cursor:pointer;" onclick="showTab(\'register\')">Register</span>';
    } else {
        bottomLink.innerHTML = 'Already have an account? <span style="color:#1565c0; cursor:pointer;" onclick="showTab(\'login\')">Login</span>';
    }
}

// Register
async function registerUser() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const error = document.getElementById('register-error');

    error.style.color = 'red';
    error.textContent = '';

    if (!name || !email || !password) {
        error.textContent = 'Please fill all fields!';
        return;
    }
    if (password.length < 6) {
        error.textContent = 'Password must be at least 6 characters!';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.message;
            return;
        }

        error.style.color = 'green';
        error.textContent = 'Registration successful! Please login now.';
        setTimeout(() => showTab('login'), 1500);

    } catch (err) {
        error.textContent = 'Server error! Make sure backend is running.';
    }
}

// Login
async function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');

    error.style.color = 'red';
    error.textContent = '';

    if (!email || !password) {
        error.textContent = 'Please enter email and password!';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.message;
            return;
        }

        // Save token
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        window.location.href = 'dashboard.html';

    } catch (err) {
        error.textContent = 'Server error! Make sure backend is running.';
    }
}