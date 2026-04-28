// Check login
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('welcome-msg').textContent = 'Welcome, ' + user.name;
    renderExpenses();
};

// Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Get expenses
function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses') || '[]');
}

// Render expenses
function renderExpenses() {
    const expenses = getExpenses();
    const category = document.getElementById('filter-category').value;
    const month = document.getElementById('filter-month').value;
    const list = document.getElementById('expense-list');
    const noData = document.getElementById('no-expenses');

    const now = new Date();

    let filtered = expenses.filter(e => {
        const expDate = new Date(e.date);
        if (category !== 'all' && e.category !== category) return false;
        if (month === 'this' && (expDate.getMonth() !== now.getMonth() || expDate.getFullYear() !== now.getFullYear())) return false;
        if (month === 'last') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            if (expDate.getMonth() !== lastMonth.getMonth() || expDate.getFullYear() !== lastMonth.getFullYear()) return false;
        }
        return true;
    });

    // Update summary cards
    const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const thisMonth = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + parseFloat(e.amount), 0);

    document.getElementById('total-amount').textContent = '₹' + total.toLocaleString('en-IN');
    document.getElementById('month-amount').textContent = '₹' + thisMonth.toLocaleString('en-IN');
    document.getElementById('total-entries').textContent = expenses.length;

    // Render rows
    if (filtered.length === 0) {
        list.innerHTML = '';
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';
    list.innerHTML = filtered.map((e, i) => `
    <div class="expense-row">
      <span>${e.description}</span>
      <span><span class="category-badge">${e.category}</span></span>
      <span>${new Date(e.date).toLocaleDateString('en-IN')}</span>
      <span class="amount-cell">₹${parseFloat(e.amount).toLocaleString('en-IN')}</span>
      <button class="btn-delete" onclick="deleteExpense(${e.id})">Delete</button>
    </div>
  `).join('');
}

// Delete expense
function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}