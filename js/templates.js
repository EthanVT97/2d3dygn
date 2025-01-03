export const loginTemplate = `
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
