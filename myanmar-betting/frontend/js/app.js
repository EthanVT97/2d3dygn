import api from './api.js';
import { landingTemplate, loginTemplate, mainTemplate, loadingTemplate } from './templates.js';
import { formatMoney, formatDate, getTransactionStatus, updateTodayNumbers } from './utils.js';

// Router
function router() {
    const app = document.getElementById('app');
    const token = localStorage.getItem('auth_token');

    if (token) {
        app.innerHTML = mainTemplate;
        setupMainHandlers();
        loadUserData();
        loadProfileData();
    } else {
        app.innerHTML = loginTemplate;
        setupLoginHandlers();
    }
}

// Event Handlers
function setupLoginHandlers() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const app = document.getElementById('app');
            
            // Get form values before showing loading screen
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('password');
            
            if (!phoneInput || !passwordInput) {
                showError('Form elements not found');
                return;
            }
            
            const phone = phoneInput.value;
            const password = passwordInput.value;
            
            if (!phone || !password) {
                showError('ဖုန်းနံပါတ်နှင့် စကားဝှက်ကို ဖြည့်သွင်းပေးပါ။');
                return;
            }
            
            // Show loading screen
            app.innerHTML = loadingTemplate;

            try {
                const data = await api.login(phone, password);
                if (data.success) {
                    localStorage.setItem('auth_token', data.token);
                    router();
                } else {
                    app.innerHTML = loginTemplate;
                    showError('ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။');
                    setupLoginHandlers();
                }
            } catch (error) {
                console.error('Login error:', error);
                app.innerHTML = loginTemplate;
                showError('ဆာဗာနှင့် ဆက်သွယ်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။');
                setupLoginHandlers();
            }
        });
    }
}

function setupLandingHandlers() {
    const loginBtn = document.getElementById('loginBtn');
    const startBtn = document.getElementById('startBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const app = document.getElementById('app');
            app.innerHTML = loginTemplate;
            setupLoginHandlers();
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const app = document.getElementById('app');
            app.innerHTML = loginTemplate;
            setupLoginHandlers();
        });
    }
}

function setupMainHandlers() {
    setupLogoutHandler();
    setupBettingHandlers();
    setupTabHandlers();
    setupProfileHandlers();
    setupPaymentHandlers();
    setupThaiLotteryHandlers();
    setupLaosLotteryHandlers();
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
                if (!numbers || !amount) {
                    showError('နံပါတ်များနှင့် ငွေပမာဏကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                const data = await api.placeBet(numbers, amount);
                if (data.success) {
                    alert('ထီထိုးခြင်း အောင်မြင်ပါသည်။');
                    loadUserData();
                    form.reset();
                } else {
                    showError('ထီထိုးခြင်း မအောင်မြင်ပါ။');
                }
            } catch (error) {
                showError('ဆာဗာနှင့် ဆက်သွယ်၍မရပါ။ နောက်မှ ထပ်ကြိုးစားကြည့်ပါ။');
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

// Profile Handlers
function setupProfileHandlers() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async () => {
            const oldPassword = prompt('လက်ရှိစကားဝှက်ကို ထည့်ပါ:');
            const newPassword = prompt('စကားဝှက်အသစ်ကို ထည့်ပါ:');
            
            try {
                if (!oldPassword || !newPassword) {
                    showError('လက်ရှိစကားဝှက်နှင့် စကားဝှက်အသစ်ကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                await api.updatePassword(oldPassword, newPassword);
                alert('စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။');
            } catch (error) {
                showError('စကားဝှက် ပြောင်းလဲခြင်း မအောင်မြင်ပါ။');
            }
        });
    }
}

// Payment Handlers
function setupPaymentHandlers() {
    const methodCards = document.querySelectorAll('.method-card');
    const depositForm = document.getElementById('depositForm');
    const withdrawForm = document.getElementById('withdrawForm');

    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.method;
            if (depositForm) {
                depositForm.style.display = 'block';
                depositForm.dataset.method = method;
            }
            if (withdrawForm) {
                withdrawForm.style.display = 'block';
                withdrawForm.dataset.method = method;
            }
        });
    });

    if (depositForm) {
        depositForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('depositAmount').value;
            const transactionId = document.getElementById('transactionId').value;
            const method = depositForm.dataset.method;

            try {
                if (!amount || !transactionId) {
                    showError('ငွေပမာဏနှင့် ငွေသွင်းခြင်း ID ကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                await api.deposit(amount, transactionId, method);
                alert('ငွေသွင်းခြင်း အောင်မြင်ပါသည်။');
                loadUserData();
            } catch (error) {
                showError('ငွေသွင်းခြင်း မအောင်မြင်ပါ။');
            }
        });
    }

    if (withdrawForm) {
        withdrawForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('withdrawAmount').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const method = withdrawForm.dataset.method;

            try {
                if (!amount || !phoneNumber) {
                    showError('ငွေပမာဏနှင့် ဖုန်းနံပါတ်ကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                await api.withdraw(amount, phoneNumber, method);
                alert('ငွေထုတ်ခြင်း အောင်မြင်ပါသည်။');
                loadUserData();
            } catch (error) {
                showError('ငွေထုတ်ခြင်း မအောင်မြင်ပါ။');
            }
        });
    }
}

// Thai Lottery Handlers
function setupThaiLotteryHandlers() {
    const thaiBettingForm = document.getElementById('thaiBettingForm');
    
    if (thaiBettingForm) {
        thaiBettingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const number = document.getElementById('thaiNumber').value;
            const amount = document.getElementById('thaiAmount').value;

            try {
                if (!number || !amount) {
                    showError('နံပါတ်နှင့် ငွေပမာဏကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                await api.placeThaiBet(number, amount);
                alert('ထိုင်းထီထိုးခြင်း အောင်မြင်ပါသည်။');
                loadUserData();
            } catch (error) {
                showError('ထိုင်းထီထိုးခြင်း မအောင်မြင်ပါ။');
            }
        });
    }

    // Load Thai lottery info
    loadThaiLotteryInfo();
}

// Laos Lottery Handlers
function setupLaosLotteryHandlers() {
    const laosBettingForm = document.getElementById('laosBettingForm');
    
    if (laosBettingForm) {
        laosBettingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const number = document.getElementById('laosNumber').value;
            const amount = document.getElementById('laosAmount').value;

            try {
                if (!number || !amount) {
                    showError('နံပါတ်နှင့် ငွေပမာဏကို ဖြည့်သွင်းပေးပါ။');
                    return;
                }

                await api.placeLaosBet(number, amount);
                alert('လာအိုထီထိုးခြင်း အောင်မြင်ပါသည်။');
                loadUserData();
            } catch (error) {
                showError('လာအိုထီထိုးခြင်း မအောင်မြင်ပါ။');
            }
        });
    }

    // Load Laos lottery info
    loadLaosLotteryInfo();
}

// Data Loading Functions
async function loadThaiLotteryInfo() {
    try {
        const info = await api.getThaiLotteryInfo();
        document.getElementById('thaiNextDraw').textContent = info.nextDraw;
        document.getElementById('thaiLastResult').textContent = info.lastResult;
    } catch (error) {
        console.error('Error loading Thai lottery info:', error);
    }
}

async function loadLaosLotteryInfo() {
    try {
        const info = await api.getLaosLotteryInfo();
        document.getElementById('laosNextDraw').textContent = info.nextDraw;
        document.getElementById('laosLastResult').textContent = info.lastResult;
    } catch (error) {
        console.error('Error loading Laos lottery info:', error);
    }
}

async function loadProfileData() {
    try {
        const profile = await api.getProfile();
        document.getElementById('userPhone').textContent = profile.phone;
        document.getElementById('userBalance').textContent = formatMoney(profile.balance);
        document.getElementById('lastLogin').textContent = formatDate(profile.lastLogin);
    } catch (error) {
        console.error('Error loading profile:', error);
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

function showLoading() {
    document.getElementById('app').innerHTML = loadingTemplate;
}

function hideLoading() {
    // This will be called by the specific page render functions
}

function showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = getErrorTemplate(message);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

// Dark mode
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize theme on page load
initTheme();

// Add event listener for theme toggle
document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle')) {
        toggleTheme();
    }
});

// Auto-update lucky numbers
setInterval(updateTodayNumbers, 60000); // Update every minute

// Tab switching animation handler
function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content with animation
    const selectedContent = document.getElementById(tabId);
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    
    if (selectedContent && selectedTab) {
        // Add active class to trigger animation
        selectedContent.classList.add('active');
        selectedTab.classList.add('active');
    }
}

// Add event listeners for tab switching
document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) {
        const tabId = tab.dataset.tab;
        switchTab(tabId);
    }
});

// Initialize
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);
