// Constants
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'  // Development
    : 'https://myanmar-betting-api.onrender.com/api/v1';  // Production
const TOKEN_KEY = 'auth_token';
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

    // Profile endpoints
    getProfile() {
        return this.request('/profile', { method: 'GET' });
    },

    updatePassword(oldPassword, newPassword) {
        return this.request('/profile/password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });
    },

    // Payment endpoints
    deposit(amount, transactionId, method) {
        return this.request('/deposit', {
            method: 'POST',
            body: JSON.stringify({ amount, transactionId, method })
        });
    },

    withdraw(amount, phoneNumber, method) {
        return this.request('/withdraw', {
            method: 'POST',
            body: JSON.stringify({ amount, phoneNumber, method })
        });
    },

    // Thai Lottery endpoints
    getThaiLotteryInfo() {
        return this.request('/thai-lottery/info', { method: 'GET' });
    },

    placeThaiBet(number, amount) {
        return this.request('/thai-lottery/bet', {
            method: 'POST',
            body: JSON.stringify({ number, amount })
        });
    },

    // Laos Lottery endpoints
    getLaosLotteryInfo() {
        return this.request('/laos-lottery/info', { method: 'GET' });
    },

    placeLaosBet(number, amount) {
        return this.request('/laos-lottery/bet', {
            method: 'POST',
            body: JSON.stringify({ number, amount })
        });
    }
};

export default api;
