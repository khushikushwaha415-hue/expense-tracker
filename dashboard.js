const API_URL = 'https://expense-tracker-api-ybls.onrender.com/api';


// Check login
window.onload = function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    const userName = localStorage.getItem('userName');
    document.getElementById('welcome-msg').textContent = 'Welcome, ' + userName;
    renderExpenses();
};

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Get expenses from API
async function renderExpenses() {
    const token = localStorage.getItem('token');
    const category = document.getElementById('filter-category').value;
    const month = document.getElementById('filter-month').value;

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const expenses = await response.json();
        const now = new Date();

        // Filter
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

        // Summary cards
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        const thisMonth = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).reduce((sum, e) => sum + e.amount, 0);

        document.getElementById('total-amount').textContent = '₹' + total.toLocaleString('en-IN');
        document.getElementById('month-amount').textContent = '₹' + thisMonth.toLocaleString('en-IN');
        document.getElementById('total-entries').textContent = expenses.length;

        // Render rows
        const list = document.getElementById('expense-list');
        const noData = document.getElementById('no-expenses');

        if (filtered.length === 0) {
            list.innerHTML = '';
            noData.style.display = 'block';
            return;
        }

        noData.style.display = 'none';
        list.innerHTML = filtered.map(e => `
      <div class="expense-row">
        <span>${e.description}</span>
        <span><span class="category-badge">${e.category}</span></span>
        <span>${new Date(e.date).toLocaleDateString('en-IN')}</span>
        <span class="amount-cell">₹${e.amount.toLocaleString('en-IN')}</span>
        <button class="btn-delete" onclick="deleteExpense('${e._id}')">Delete</button>
      </div>
    `).join('');

    } catch (err) {
        console.log('Error:', err);
    }
}

// Delete expense
async function deleteExpense(id) {
    const token = localStorage.getItem('token');

    try {
        await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        renderExpenses();
    } catch (err) {
        console.log('Error:', err);
    }
}