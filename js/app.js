import api from './api.js';
import { loginTemplate, mainTemplate } from './templates.js';
import { formatMoney, formatDate, getTransactionStatus, updateTodayNumbers } from './utils.js';

// Router
function router() {
    const app = document.getElementById('app');
    const token = localStorage.getItem('auth_token');

    if (!token) {
        app.innerHTML = loginTemplate;
        setupLoginHandlers();
    } else {
        app.innerHTML = mainTemplate;
        setupMainHandlers();
        loadUserData();
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
                localStorage.setItem('auth_token', data.token);
                router();
            } catch (error) {
                alert(error.message || 'Login failed');
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
                localStorage.removeItem('auth_token');
                router();
            }
        });
    }
}

async function loadUserData() {
    try {
        const [balanceData, historyData] = await Promise.all([
            api.getBalance(),
            api.getTransactions()
        ]);

        updateBalance(balanceData.balance);
        updateHistory(historyData);
        updateTodayNumbers();
    } catch (error) {
        console.error('Error loading user data:', error);
        if (error.message === 'Unauthorized') {
            localStorage.removeItem('auth_token');
            router();
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

// Auto-update lucky numbers
setInterval(updateTodayNumbers, 60000); // Update every minute

// Initialize
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);
