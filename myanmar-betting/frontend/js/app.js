// Constants
const API_URL = 'https://myanmar-betting-api.onrender.com/api';
const TOKEN_KEY = 'auth_token';

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
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ phone, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

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
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                });
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
                const response = await fetch(`${API_URL}/lottery/bet`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        numbers: numbers.split(',').map(n => n.trim()),
                        amount: parseFloat(amount),
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to place bet');
                }

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
        const [balanceRes, historyRes] = await Promise.all([
            fetch(`${API_URL}/balance`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },
            }),
            fetch(`${API_URL}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },
            }),
        ]);

        if (!balanceRes.ok || !historyRes.ok) {
            throw new Error('Failed to load user data');
        }

        const balanceData = await balanceRes.json();
        const historyData = await historyRes.json();

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
