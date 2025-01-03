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
    <div class="login-container fadeIn">
        <h1><i class="fas fa-coins"></i> 2D3D ထီဆိုင်</h1>
        <form id="loginForm" class="login-form">
            <div class="form-group">
                <label for="phone"><i class="fas fa-phone"></i> ဖုန်းနံပါတ်</label>
                <input type="tel" id="phone" name="phone" required placeholder="09xxxxxxxxx" pattern="[0-9]{11}">
            </div>
            <div class="form-group">
                <label for="password"><i class="fas fa-lock"></i> စကားဝှက်</label>
                <input type="password" id="password" name="password" required placeholder="စကားဝှက်ရိုက်ထည့်ပါ">
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> ဝင်ရောက်မည်
            </button>
        </form>
    </div>
`;

const mainTemplate = `
    <header class="header">
        <nav class="nav container">
            <h1><i class="fas fa-coins"></i> 2D3D ထီဆိုင်</h1>
            <div class="nav-balance">
                <i class="fas fa-wallet"></i>
                <span>လက်ကျန်ငွေ: <span id="balance">0</span> ကျပ်</span>
                <button id="logoutBtn" class="btn btn-secondary">
                    <i class="fas fa-sign-out-alt"></i> ထွက်မည်
                </button>
            </div>
        </nav>
    </header>

    <main class="container fadeIn">
        <div class="lucky-numbers">
            <i class="fas fa-star"></i> ယနေ့ထွက်ဂဏန်း: <span id="todayNumbers">12:00 PM - ထွက်ရန်ကျန်</span>
        </div>

        <div class="lottery-tabs">
            <button class="tab-button active" data-tab="2d">
                <i class="fas fa-dice-two"></i> 2D ထီ
            </button>
            <button class="tab-button" data-tab="3d">
                <i class="fas fa-dice-three"></i> 3D ထီ
            </button>
        </div>

        <section id="2d-section" class="betting-section fadeIn">
            <h2><i class="fas fa-dice-two"></i> 2D ထီထိုးမည်</h2>
            <form id="betting2dForm" class="betting-form">
                <div class="form-group">
                    <label for="numbers2d">
                        <i class="fas fa-sort-numeric-up"></i> ထီဂဏန်း (ဥပမာ - 23,45)
                    </label>
                    <input type="text" 
                           id="numbers2d" 
                           class="form-control" 
                           required 
                           placeholder="ဂဏန်းနှစ်လုံး ရိုက်ထည့်ပါ"
                           pattern="[0-9]{2}"
                           maxlength="2">
                </div>
                <div class="form-group">
                    <label for="amount2d">
                        <i class="fas fa-money-bill-wave"></i> ငွေပမာဏ (ကျပ်)
                    </label>
                    <input type="number" 
                           id="amount2d" 
                           class="form-control" 
                           min="100" 
                           step="100" 
                           required 
                           placeholder="ထိုးမည့်ငွေပမာဏ">
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check-circle"></i> ထီထိုးမည်
                </button>
            </form>
        </section>

        <section id="3d-section" class="betting-section fadeIn" style="display: none;">
            <h2><i class="fas fa-dice-three"></i> 3D ထီထိုးမည်</h2>
            <form id="betting3dForm" class="betting-form">
                <div class="form-group">
                    <label for="numbers3d">
                        <i class="fas fa-sort-numeric-up"></i> ထီဂဏန်း (ဥပမာ - 234,567)
                    </label>
                    <input type="text" 
                           id="numbers3d" 
                           class="form-control" 
                           required 
                           placeholder="ဂဏန်းသုံးလုံး ရိုက်ထည့်ပါ"
                           pattern="[0-9]{3}"
                           maxlength="3">
                </div>
                <div class="form-group">
                    <label for="amount3d">
                        <i class="fas fa-money-bill-wave"></i> ငွေပမာဏ (ကျပ်)
                    </label>
                    <input type="number" 
                           id="amount3d" 
                           class="form-control" 
                           min="100" 
                           step="100" 
                           required 
                           placeholder="ထိုးမည့်ငွေပမာဏ">
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check-circle"></i> ထီထိုးမည်
                </button>
            </form>
        </section>

        <section class="betting-section fadeIn">
            <h2><i class="fas fa-history"></i> ထီထိုးမှတ်တမ်း</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th><i class="fas fa-calendar-alt"></i> ရက်စွဲ</th>
                        <th><i class="fas fa-sort-numeric-up"></i> ထီဂဏန်း</th>
                        <th><i class="fas fa-money-bill-wave"></i> ငွေပမာဏ</th>
                        <th><i class="fas fa-info-circle"></i> အခြေအနေ</th>
                    </tr>
                </thead>
                <tbody id="historyTable">
                </tbody>
            </table>
        </section>
    </main>
`;

// Helper Functions
function formatMoney(amount) {
    return new Intl.NumberFormat('my-MM').format(amount);
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString('my-MM', options);
}

function getTransactionStatus(status) {
    const statusClasses = {
        pending: 'status-pending',
        completed: 'status-completed',
        won: 'status-won',
        lost: 'status-lost'
    };

    const statusText = {
        pending: 'စောင့်ဆိုင်းဆဲ',
        completed: 'ပြီးဆုံး',
        won: 'ထီပေါက်',
        lost: 'မပေါက်'
    };

    const statusClass = statusClasses[status.toLowerCase()] || '';
    const text = statusText[status.toLowerCase()] || status;

    return `<span class="status-badge ${statusClass}">${text}</span>`;
}

function updateTodayNumbers() {
    const now = new Date();
    const noon = new Date(now);
    noon.setHours(12, 0, 0, 0);

    const evening = new Date(now);
    evening.setHours(16, 30, 0, 0);

    const numbersElement = document.getElementById('todayNumbers');
    if (!numbersElement) return;

    if (now < noon) {
        const timeLeft = Math.floor((noon - now) / (1000 * 60));
        numbersElement.textContent = `12:00 PM - ${timeLeft} မိနစ် ကျန်ပါသေးသည်`;
    } else if (now < evening) {
        const timeLeft = Math.floor((evening - now) / (1000 * 60));
        numbersElement.textContent = `4:30 PM - ${timeLeft} မိနစ် ကျန်ပါသေးသည်`;
    } else {
        numbersElement.textContent = 'ယနေ့အတွက် ပိတ်ပါပြီ';
    }
}

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
    setupBettingHandlers();
    setupTabHandlers();
}

function setupTabHandlers() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const sections = {
        '2d': document.getElementById('2d-section'),
        '3d': document.getElementById('3d-section')
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show/hide sections
            Object.entries(sections).forEach(([key, section]) => {
                section.style.display = key === tab ? 'block' : 'none';
            });
        });
    });
}

function setupBettingHandlers() {
    setupBettingForm('2d');
    setupBettingForm('3d');
}

function setupBettingForm(type) {
    const form = document.getElementById(`betting${type}Form`);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const numbers = document.getElementById(`numbers${type}`).value;
            const amount = document.getElementById(`amount${type}`).value;

            try {
                const data = await api.placeBet(numbers, amount);
                alert('ထီထိုးခြင်း အောင်မြင်ပါသည်။');
                loadUserData();
                form.reset();
            } catch (error) {
                alert(error.message || 'ထီထိုးခြင်း မအောင်မြင်ပါ။');
            }
        });
    }
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

async function loadUserData() {
    try {
        const [balanceData, historyData] = await Promise.all([
            api.getBalance(),
            api.getTransactions(),
        ]);

        updateBalance(balanceData.balance);
        updateHistory(historyData);
        updateTodayNumbers();
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
        balanceElement.textContent = formatMoney(balance);
    }
}

function updateHistory(transactions) {
    const tableBody = document.getElementById('historyTable');
    if (tableBody) {
        tableBody.innerHTML = transactions.map(t => `
            <tr>
                <td>${formatDate(t.created_at)}</td>
                <td>${t.numbers.join(', ')}</td>
                <td>${formatMoney(t.amount)} ကျပ်</td>
                <td>${getTransactionStatus(t.status)}</td>
            </tr>
        `).join('');
    }
}

// Initialize
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);