export const loginTemplate = `
    <div class="login-container page-transition fadeIn">
        <h1><i class="fas fa-coins"></i> 2D3D ထီဆိုင်</h1>
        <form id="loginForm" class="login-form">
            <div class="form-group">
                <input type="tel" class="form-control" id="phone" required placeholder=" " pattern="[0-9]{11}">
                <label class="form-label" for="phone"><i class="fas fa-phone"></i> ဖုန်းနံပါတ်</label>
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="password" required placeholder=" ">
                <label class="form-label" for="password"><i class="fas fa-lock"></i> စကားဝှက်</label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> ဝင်ရောက်မည်
            </button>
        </form>
    </div>
`;

export const landingTemplate = `
    <div class="landing-container page-transition">
        <header class="landing-header">
            <div class="logo">
                <i class="fas fa-coins"></i>
                <h1>2D3D ထီဆိုင်</h1>
            </div>
            <button id="loginBtn" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> ဝင်ရောက်ရန်
            </button>
        </header>

        <main class="landing-main">
            <section class="hero-section">
                <h2>မြန်မာ့ထီလောင်းကစားဝန်ဆောင်မှု</h2>
                <p>နှစ်လုံးထီ၊ သုံးလုံးထီ၊ ထိုင်းထီ နှင့် လာအိုထီများကို တစ်နေရာတည်းတွင် လောင်းကစားနိုင်</p>
            </section>

            <section class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-dice-two"></i>
                    <h3>နှစ်လုံးထီ</h3>
                    <p>နေ့စဉ် မနက်ပိုင်း နှင့် ညနေပိုင်း ၂ ကြိမ်ထိုးနိုင်</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-dice-three"></i>
                    <h3>သုံးလုံးထီ</h3>
                    <p>လစဉ် ၂ ကြိမ် ပေါက်ဂဏန်းများနှင့်အတူ ဆုကြေးငွေများများရယူနိုင်</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-globe-asia"></i>
                    <h3>ထိုင်းထီ</h3>
                    <p>ထိုင်းနိုင်ငံ၏ တရားဝင်ထီဂဏန်းများကို လောင်းကစားနိုင်</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-money-bill-wave"></i>
                    <h3>လာအိုထီ</h3>
                    <p>လာအိုနိုင်ငံ၏ ထီဂဏန်းများဖြင့် ကံစမ်းနိုင်</p>
                </div>
            </section>

            <section class="benefits-section">
                <h2>အားသာချက်များ</h2>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <i class="fas fa-mobile-alt"></i>
                        <h4>မိုဘိုင်းဖြင့် အချိန်မရွေး</h4>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-shield-alt"></i>
                        <h4>စိတ်ချလုံခြုံ</h4>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-bolt"></i>
                        <h4>လျင်မြန်</h4>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-percentage"></i>
                        <h4>ဆုကြေးများ</h4>
                    </div>
                </div>
            </section>

            <section class="cta-section">
                <h2>ယခုပင် စတင်ကံစမ်းလိုက်ပါ</h2>
                <button id="startBtn" class="btn btn-large btn-primary">
                    <i class="fas fa-play"></i> စတင်ရန်
                </button>
            </section>
        </main>

        <footer class="landing-footer">
            <p> 2025 2D3D ထီဆိုင်။ မူပိုင်ခွင့်များရယူထားပြီး ဖြစ်ပါသည်။</p>
        </footer>
    </div>
`;

export const mainTemplate = `
    <header class="header">
        <nav class="nav container">
            <h1><i class="fas fa-coins"></i> 2D3D ထီဆိုင်</h1>
            <div class="nav-balance">
                <i class="fas fa-wallet"></i>
                <span>လက်ကျန်ငွေ: <span id="balance">0</span> ကျပ်</span>
                <button id="logoutBtn" class="btn btn-secondary">
                    <i class="fas fa-sign-out-alt"></i> ထွက်မည်
                </button>
                <button class="btn-icon" id="theme-toggle">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </nav>
    </header>

    <main class="container page-transition fadeIn">
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
                    <input type="text" class="form-control" id="numbers2d" required placeholder=" " pattern="[0-9]{2}" maxlength="2">
                    <label class="form-label" for="numbers2d"><i class="fas fa-sort-numeric-up"></i> ထီဂဏန်း (ဥပမာ - 23,45)</label>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" id="amount2d" required min="100" step="100" placeholder=" ">
                    <label class="form-label" for="amount2d"><i class="fas fa-money-bill-wave"></i> ငွေပမာဏ (ကျပ်)</label>
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
                    <input type="text" class="form-control" id="numbers3d" required placeholder=" " pattern="[0-9]{3}" maxlength="3">
                    <label class="form-label" for="numbers3d"><i class="fas fa-sort-numeric-up"></i> ထီဂဏန်း (ဥပမာ - 234,567)</label>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" id="amount3d" required min="100" step="100" placeholder=" ">
                    <label class="form-label" for="amount3d"><i class="fas fa-money-bill-wave"></i> ငွေပမာဏ (ကျပ်)</label>
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

export const profileTemplate = `
    <div class="profile-container page-transition">
        <h2><i class="fas fa-user-circle"></i> ကိုယ်ရေးအချက်အလက်</h2>
        <div class="profile-info">
            <div class="info-item">
                <label>ဖုန်းနံပါတ်:</label>
                <span id="userPhone"></span>
            </div>
            <div class="info-item">
                <label>လက်ကျန်ငွေ:</label>
                <span id="userBalance"></span>
            </div>
            <div class="info-item">
                <label>နောက်ဆုံးဝင်ရောက်သည့်အချိန်:</label>
                <span id="lastLogin"></span>
            </div>
        </div>
        <div class="profile-actions">
            <button id="changePasswordBtn" class="btn btn-secondary">
                <i class="fas fa-key"></i> စကားဝှက်ပြောင်းရန်
            </button>
        </div>
    </div>
`;

export const depositTemplate = `
    <div class="deposit-container page-transition">
        <h2><i class="fas fa-money-bill-wave"></i> ငွေသွင်းရန်</h2>
        <div class="payment-methods">
            <h3>ငွေသွင်းနည်းလမ်းများ</h3>
            <div class="method-grid">
                <div class="method-card" data-method="kpay">
                    <img src="/images/kpay.png" alt="KPay">
                    <h4>KBZ Pay</h4>
                </div>
                <div class="method-card" data-method="wavepay">
                    <img src="/images/wavepay.png" alt="WavePay">
                    <h4>Wave Pay</h4>
                </div>
                <div class="method-card" data-method="cbpay">
                    <img src="/images/cbpay.png" alt="CBPay">
                    <h4>CB Pay</h4>
                </div>
            </div>
        </div>
        <form id="depositForm" class="deposit-form" style="display: none;">
            <div class="form-group">
                <input type="number" class="form-control" id="depositAmount" required min="1000" placeholder=" ">
                <label class="form-label" for="depositAmount">ငွေပမာဏ</label>
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="transactionId" required placeholder=" ">
                <label class="form-label" for="transactionId">ငွေလွှဲပြေစာ အမှတ်</label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-check"></i> အတည်ပြုရန်
            </button>
        </form>
    </div>
`;

export const withdrawTemplate = `
    <div class="withdraw-container page-transition">
        <h2><i class="fas fa-money-bill-wave"></i> ငွေထုတ်ရန်</h2>
        <div class="payment-methods">
            <h3>ငွေထုတ်နည်းလမ်းများ</h3>
            <div class="method-grid">
                <div class="method-card" data-method="kpay">
                    <img src="/images/kpay.png" alt="KPay">
                    <h4>KBZ Pay</h4>
                </div>
                <div class="method-card" data-method="wavepay">
                    <img src="/images/wavepay.png" alt="WavePay">
                    <h4>Wave Pay</h4>
                </div>
                <div class="method-card" data-method="cbpay">
                    <img src="/images/cbpay.png" alt="CBPay">
                    <h4>CB Pay</h4>
                </div>
            </div>
        </div>
        <form id="withdrawForm" class="withdraw-form" style="display: none;">
            <div class="form-group">
                <input type="number" class="form-control" id="withdrawAmount" required min="1000" placeholder=" ">
                <label class="form-label" for="withdrawAmount">ငွေပမာဏ</label>
            </div>
            <div class="form-group">
                <input type="tel" class="form-control" id="phoneNumber" required placeholder=" ">
                <label class="form-label" for="phoneNumber">ငွေလက်ခံမည့် ဖုန်းနံပါတ်</label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-check"></i> အတည်ပြုရန်
            </button>
        </form>
    </div>
`;

export const thaiLotteryTemplate = `
    <div class="thai-lottery-container page-transition">
        <h2><i class="fas fa-globe-asia"></i> ထိုင်းထီ</h2>
        <div class="lottery-info">
            <div class="info-card">
                <h3>ပေါက်ဂဏန်း ကြေညာချိန်</h3>
                <p id="thaiNextDraw"></p>
            </div>
            <div class="info-card">
                <h3>နောက်ဆုံးပေါက်ဂဏန်း</h3>
                <p id="thaiLastResult"></p>
            </div>
        </div>
        <form id="thaiBettingForm" class="betting-form">
            <div class="form-group">
                <input type="text" class="form-control" id="thaiNumber" required maxlength="6" pattern="[0-9]{6}" placeholder=" ">
                <label class="form-label" for="thaiNumber">ထိုးလိုသည့်ဂဏန်း</label>
            </div>
            <div class="form-group">
                <input type="number" class="form-control" id="thaiAmount" required min="100" placeholder=" ">
                <label class="form-label" for="thaiAmount">ထိုးကြေး</label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-check"></i> ထိုးမည်
            </button>
        </form>
    </div>
`;

export const laosLotteryTemplate = `
    <div class="laos-lottery-container page-transition">
        <h2><i class="fas fa-globe-asia"></i> လာအိုထီ</h2>
        <div class="lottery-info">
            <div class="info-card">
                <h3>ပေါက်ဂဏန်း ကြေညာချိန်</h3>
                <p id="laosNextDraw"></p>
            </div>
            <div class="info-card">
                <h3>နောက်ဆုံးပေါက်ဂဏန်း</h3>
                <p id="laosLastResult"></p>
            </div>
        </div>
        <form id="laosBettingForm" class="betting-form">
            <div class="form-group">
                <input type="text" class="form-control" id="laosNumber" required maxlength="6" pattern="[0-9]{6}" placeholder=" ">
                <label class="form-label" for="laosNumber">ထိုးလိုသည့်ဂဏန်း</label>
            </div>
            <div class="form-group">
                <input type="number" class="form-control" id="laosAmount" required min="100" placeholder=" ">
                <label class="form-label" for="laosAmount">ထိုးကြေး</label>
            </div>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-check"></i> ထိုးမည်
            </button>
        </form>
    </div>
`;

export const loadingTemplate = `
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>ခဏစောင့်ပါ...</p>
    </div>
`;

function getLoadingTemplate() {
    return `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">ခဏစောင့်ပါ...</p>
        </div>
    `;
}

function getErrorTemplate(message) {
    return `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}
