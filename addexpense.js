const API_URL = 'http://localhost:5000/api';

// Check login
window.onload = function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    const userName = localStorage.getItem('userName');
    document.getElementById('welcome-msg').textContent = 'Welcome, ' + userName;

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
};

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Add Expense
async function addExpense() {
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const error = document.getElementById('form-error');
    const success = document.getElementById('form-success');

    error.textContent = '';
    success.textContent = '';

    if (!description || !amount || !category || !date) {
        error.textContent = 'Please fill all fields!';
        return;
    }
    if (parseFloat(amount) <= 0) {
        error.textContent = 'Amount must be greater than 0!';
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description,
                amount: parseFloat(amount),
                category,
                date
            })
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.message;
            return;
        }

        success.textContent = 'Expense added successfully!';

        // Clear form
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (err) {
        error.textContent = 'Server error! Make sure backend is running.';
    }
}