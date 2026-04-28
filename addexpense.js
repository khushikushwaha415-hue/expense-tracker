// Check login
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('welcome-msg').textContent = 'Welcome, ' + user.name;

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
};

// Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Add Expense
function addExpense() {
    const description = document.getElementById('description').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const error = document.getElementById('form-error');
    const success = document.getElementById('form-success');

    error.textContent = '';
    success.textContent = '';

    // Validation
    if (!description || !amount || !category || !date) {
        error.textContent = 'Please fill all fields!';
        return;
    }
    if (parseFloat(amount) <= 0) {
        error.textContent = 'Amount must be greater than 0!';
        return;
    }

    // Save to localStorage
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const newExpense = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
        date
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Show success
    success.textContent = 'Expense added successfully!';

    // Clear form
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}