// API Configuration
const API_URL = 'https://myanmar-betting-api.onrender.com/api';

// Authentication Functions
const auth = {
    token: localStorage.getItem('token'),
    
    isAuthenticated() {
        return !!this.token;
    },

    async login(phone, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ phone, password })
            });
            
            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                localStorage.setItem('token', data.token);
                return true;
            }
            if (data.message) {
                throw new Error(data.message);
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    }
};

// Betting Functions
const betting = {
    async placeBet(numbers, amount) {
        try {
            const response = await fetch(`${API_URL}/lottery/bet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    numbers: numbers.split(',').map(n => n.trim()),
                    amount: parseFloat(amount)
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Betting error:', error);
            return { error: 'Failed to place bet' };
        }
    },

    async getBettingHistory() {
        try {
            const response = await fetch(`${API_URL}/transactions?type=bet`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            return data.data; // Laravel pagination returns data in data field
        } catch (error) {
            console.error('History fetch error:', error);
            return { error: 'Failed to fetch history' };
        }
    },

    async getBalance() {
        try {
            const response = await fetch(`${API_URL}/balance`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            return data.balance;
        } catch (error) {
            console.error('Balance fetch error:', error);
            return 0;
        }
    }
};

// UI Helper Functions
const ui = {
    showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => alertDiv.remove(), 3000);
    },

    async updateBalance() {
        const balance = await betting.getBalance();
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = balance.toLocaleString();
        }
    },

    async updateHistory() {
        const history = await betting.getBettingHistory();
        const historyTable = document.getElementById('historyTable');
        if (historyTable && Array.isArray(history)) {
            historyTable.innerHTML = history.map(bet => `
                <tr>
                    <td>${new Date(bet.created_at).toLocaleString()}</td>
                    <td>${bet.numbers.join(', ')}</td>
                    <td>${bet.amount.toLocaleString()}</td>
                    <td>${bet.status}</td>
                </tr>
            `).join('');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Check Authentication
    if (!auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html';
        return;
    }

    // Update UI if authenticated
    if (auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
        await ui.updateBalance();
        await ui.updateHistory();
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            try {
                const success = await auth.login(phone, password);
                if (success) {
                    window.location.href = '/index.html';
                } else {
                    ui.showMessage('Login failed. Please check your credentials.', 'error');
                }
            } catch (error) {
                ui.showMessage(error.message, 'error');
            }
        });
    }

    // Betting Form
    const bettingForm = document.getElementById('bettingForm');
    if (bettingForm) {
        bettingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const numbers = document.getElementById('numbers').value;
            const amount = document.getElementById('amount').value;
            
            const result = await betting.placeBet(numbers, amount);
            if (result.error) {
                ui.showMessage(result.error, 'error');
            } else {
                ui.showMessage('Bet placed successfully!', 'success');
                await ui.updateBalance();
                await ui.updateHistory();
            }
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.logout());
    }
});
