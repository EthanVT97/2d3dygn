// Constants
const API_URL = 'https://myanmar-betting-api.onrender.com/api';
const TOKEN_KEY = 'auth_token';

// Debug mode
const DEBUG = true;

// API Helper
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const token = localStorage.getItem(TOKEN_KEY);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            credentials: 'include',
        };

        const fetchOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {}),
            },
        };

        try {
            if (DEBUG) console.log(`API Request: ${url}`, fetchOptions);
            
            const response = await fetch(url, fetchOptions);
            const data = await response.json();

            if (DEBUG) console.log(`API Response: ${url}`, data);

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error: ${url}`, error);
            throw error;
        }
    },

    // Auth endpoints
    async login(phone, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        });
    },

    async logout() {
        return this.request('/logout', {
            method: 'POST',
        });
    },

    // User data endpoints
    async getBalance() {
        return this.request('/balance');
    },

    async getTransactions() {
        return this.request('/transactions');
    },

    // Betting endpoints
    async placeBet(numbers, amount) {
        return this.request('/lottery/bet', {
            method: 'POST',
            body: JSON.stringify({
                numbers: numbers.split(',').map(n => n.trim()),
                amount: parseFloat(amount),
            }),
        });
    },
};

// HTML Templates
const loginTemplate = `
    <div class="login-container">
        <h1>Myanmar Betting</h1>
        <form id="loginForm" class="login-form">
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>
`;

const mainTemplate = `
    <header class="header">
        <nav class="nav container">
            <h1>Myanmar Betting</h1>
            <div>
                <span>Balance: $<span id="balance">0.00</span></span>
                <button id="logoutBtn" class="btn btn-secondary">Logout</button>
            </div>
        </nav>
    </header>

    <main class="container">
        <section class="betting-section">
            <h2>Place Your Bet</h2>
            <form id="bettingForm">
                <div class="form-group">
                    <label for="numbers">Numbers (comma separated)</label>
                    <input type="text" id="numbers" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="amount">Amount</label>
                    <input type="number" id="amount" class="form-control" min="1" required>
                </div>
                <button type="submit" class="btn btn-primary">Place Bet</button>
            </form>
        </section>

        <section class="betting-section">
            <h2>Betting History</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Numbers</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="historyTable">
                </tbody>
            </table>
        </section>
    </main>
`;

// Router
function router() {
    const app = document.getElementById('app');
    const token = localStorage.getItem(TOKEN_KEY);
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/';

    if (!token && path !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
        return;
    }

    if (token && path === '/login') {
        window.location.href = redirect;
        return;
    }

    switch (path) {
        case '/login':
            app.innerHTML = loginTemplate;
            setupLoginHandlers();
            break;
        case '/':
            if (!token) {
                window.location.href = '/login?redirect=/';
                return;
            }
            app.innerHTML = mainTemplate;
            setupMainHandlers();
            loadUserData();
            break;
        default:
            window.location.href = '/';
    }
}

// Event Handlers
function setupLoginHandlers() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;

            try {
                const data = await api.login(phone, password);
                localStorage.setItem(TOKEN_KEY, data.token);
                const params = new URLSearchParams(window.location.search);
                window.location.href = params.get('redirect') || '/';
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

function setupMainHandlers() {
    setupLogoutHandler();
    setupBettingHandler();
}

function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await api.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = '/login';
            }
        });
    }
}

function setupBettingHandler() {
    const form = document.getElementById('bettingForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const numbers = document.getElementById('numbers').value;
            const amount = document.getElementById('amount').value;

            try {
                const data = await api.placeBet(numbers, amount);
                alert('Bet placed successfully!');
                loadUserData();
                form.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

async function loadUserData() {
    try {
        const [balanceData, historyData] = await Promise.all([
            api.getBalance(),
            api.getTransactions(),
        ]);

        updateBalance(balanceData.balance);
        updateHistory(historyData);
    } catch (error) {
        console.error('Error loading user data:', error);
        if (error.message === 'Unauthorized') {
            window.location.href = '/login';
        }
    }
}

function updateBalance(balance) {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance.toFixed(2);
    }
}

function updateHistory(transactions) {
    const tableBody = document.getElementById('historyTable');
    if (tableBody) {
        tableBody.innerHTML = transactions.map(t => `
            <tr>
                <td>${new Date(t.created_at).toLocaleString()}</td>
                <td>${t.numbers.join(', ')}</td>
                <td>$${t.amount.toFixed(2)}</td>
                <td>${t.status}</td>
            </tr>
        `).join('');
    }
}

// Initialize
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);
