// Tab switch
function showTab(tab) {
    document.getElementById('login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register').style.display = tab === 'register' ? 'block' : 'none';

    document.querySelectorAll('.tab').forEach((btn, i) => {
        btn.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
    });

    // Bottom link update
    const bottomLink = document.getElementById('bottom-link');
    if (tab === 'login') {
        bottomLink.innerHTML = 'Don\'t have an account? <span style="color:#1565c0; cursor:pointer;" onclick="showTab(\'register\')">Register</span>';
    } else {
        bottomLink.innerHTML = 'Already have an account? <span style="color:#1565c0; cursor:pointer;" onclick="showTab(\'login\')">Login</span>';
    }
}

// Register
function registerUser() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const error = document.getElementById('register-error');

    if (!name || !email || !password) {
        error.textContent = 'Please fill all fields!';
        return;
    }
    if (password.length < 6) {
        error.textContent = 'Password must be at least 6 characters!';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) {
        error.textContent = 'This email is already registered!';
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    error.style.color = 'green';
    error.textContent = 'Registration successful! Please login now.';

    setTimeout(() => showTab('login'), 1500);
}

// Login
function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');

    if (!email || !password) {
        error.textContent = 'Please enter email and password!';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        error.textContent = 'Invalid email or password!';
        return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
}