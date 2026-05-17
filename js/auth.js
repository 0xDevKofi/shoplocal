// auth.js - Authentication Management

// ─── State ────────────────────────────────────────────────────────────────────
let currentUser = null;

// ─── Account Registry ─────────────────────────────────────────────────────────

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem('shoplocal_accounts') || '{}');
    } catch (e) {
        return {};
    }
}

function saveAccount(userData, password) {
    const accounts = getAccounts();
    accounts[userData.email.toLowerCase()] = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        newsletter: userData.newsletter,
        password: password
    };
    localStorage.setItem('shoplocal_accounts', JSON.stringify(accounts));
}

function findAccount(email) {
    const accounts = getAccounts();
    return accounts[email.toLowerCase()] || null;
}

// ─── Session ──────────────────────────────────────────────────────────────────

function initAuth() {
    const saved = localStorage.getItem('shoplocal_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateAuthUI();
        } catch (e) {
            currentUser = null;
        }
    }
    return currentUser;
}

function saveSession(user) {
    currentUser = user;
    const { password, ...sessionUser } = user;
    localStorage.setItem('shoplocal_user', JSON.stringify(sessionUser));
    updateAuthUI();
}

// ─── Logout inline confirmation popover ──────────────────────────────────────

function showLogoutConfirm(anchorBtn) {
    dismissLogoutConfirm();

    const popover = document.createElement('div');
    popover.id = 'logoutConfirm';
    popover.className = 'logout-confirm';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', 'Confirm logout');
    popover.innerHTML = `
        <p class="logout-confirm-text">Log out of ShopLocal?</p>
        <div class="logout-confirm-actions">
            <button class="logout-confirm-cancel">Cancel</button>
            <button class="logout-confirm-ok">Log out</button>
        </div>
    `;

    anchorBtn.insertAdjacentElement('afterend', popover);
    requestAnimationFrame(() => popover.classList.add('logout-confirm-visible'));

    function dismiss() {
        popover.classList.remove('logout-confirm-visible');
        setTimeout(() => { if (popover.parentNode) popover.remove(); }, 180);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onOutsideClick, true);
    }

    popover.querySelector('.logout-confirm-cancel').addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
    });

    popover.querySelector('.logout-confirm-ok').addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
        setTimeout(logout, 190);
    });

    function onKey(e) {
        if (e.key === 'Escape') { dismiss(); anchorBtn.focus(); }
    }

    function onOutsideClick(e) {
        if (!popover.contains(e.target) && e.target !== anchorBtn) dismiss();
    }

    document.addEventListener('keydown', onKey);
    setTimeout(() => document.addEventListener('click', onOutsideClick, true), 0);
}

function dismissLogoutConfirm() {
    const existing = document.getElementById('logoutConfirm');
    if (existing) existing.remove();
}

// Alias used by profile.html sidebar button
function showLogoutModal(anchorBtn) {
    showLogoutConfirm(anchorBtn);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('shoplocal_user');
    updateAuthUI();
    window.location.href = 'index.html';
}

// ─── UI ───────────────────────────────────────────────────────────────────────

function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    if (!authLinks) return;

    if (currentUser) {
        authLinks.innerHTML = `
            <div class="user-menu">
                <button class="user-menu-toggle" aria-label="User menu" aria-expanded="false">
                    <span class="user-icon">👤</span>
                    <span class="user-name">${currentUser.firstName}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="user-dropdown">
                    <a href="profile.html"  class="dropdown-item">
                        <span class="dropdown-item-icon">👤</span> My Profile
                    </a>
                    <a href="orders.html"   class="dropdown-item">
                        <span class="dropdown-item-icon">📦</span> My Orders
                    </a>
                    <a href="wishlist.html" class="dropdown-item">
                        <span class="dropdown-item-icon">♡</span> Wishlist
                    </a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout-btn">
                        <span class="dropdown-item-icon">🚪</span> Logout
                    </button>
                </div>
            </div>
        `;

        const menuToggle = authLinks.querySelector('.user-menu-toggle');
        const dropdown   = authLinks.querySelector('.user-dropdown');
        const arrow      = authLinks.querySelector('.dropdown-arrow');

        function openDropdown() {
            dropdown.removeAttribute('hidden');
            requestAnimationFrame(() => dropdown.classList.add('open'));
            menuToggle.setAttribute('aria-expanded', 'true');
            arrow.style.transform = 'rotate(180deg)';
        }

        function closeDropdown() {
            dropdown.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            arrow.style.transform = 'rotate(0deg)';
        }

        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            this.getAttribute('aria-expanded') === 'true' ? closeDropdown() : openDropdown();
        });

        document.addEventListener('click', function (e) {
            if (!authLinks.contains(e.target) && dropdown.classList.contains('open')) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dropdown.classList.contains('open')) {
                closeDropdown();
                menuToggle.focus();
            }
        });

        authLinks.querySelector('.logout-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            showLogoutConfirm(this);
        });

    } else {
        const path     = window.location.pathname;
        const isLogin  = path.includes('login.html');
        const isSignup = path.includes('signup.html');

        authLinks.innerHTML = `
            <a href="login.html"  class="auth-link ${isLogin  ? 'active' : ''}">Login</a>
            <a href="signup.html" class="auth-link ${isSignup ? 'active' : ''}">Sign Up</a>
        `;
    }
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone);
}

function isValidPassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
}

function showFieldError(fieldId, message) {
    const err   = document.getElementById(`${fieldId}Error`);
    const field = document.getElementById(fieldId);
    if (err)   { err.textContent = message; err.classList.add('active'); }
    if (field) { field.classList.add('invalid'); }
}

function clearFieldError(fieldId) {
    const err   = document.getElementById(`${fieldId}Error`);
    const field = document.getElementById(fieldId);
    if (err)   { err.textContent = ''; err.classList.remove('active'); }
    if (field) { field.classList.remove('invalid'); }
}

// ─── Login page ───────────────────────────────────────────────────────────────

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    if (currentUser) { window.location.href = 'index.html'; return; }

    setupPasswordToggles();

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFieldError('email');
        clearFieldError('password');

        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email) { showFieldError('email', 'Email is required'); return; }
        if (!isValidEmail(email)) { showFieldError('email', 'Please enter a valid email address'); return; }
        if (!password) { showFieldError('password', 'Password is required'); return; }

        const account = findAccount(email);

        if (!account) {
            showFieldError('email', 'No account found with this email. Please sign up first.');
            return;
        }
        if (account.password !== password) {
            showFieldError('password', 'Incorrect password. Please try again.');
            return;
        }

        saveSession({
            id:        account.id,
            email:     account.email,
            firstName: account.firstName,
            lastName:  account.lastName,
            phone:     account.phone
        });

        window.location.href = 'index.html';
    });

    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function () {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else { clearFieldError('email'); }
        });
    }

    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function () {
            if (this.classList.contains('invalid')) clearFieldError('password');
        });
    }
}

// ─── Sign-up page ─────────────────────────────────────────────────────────────

function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    if (currentUser) { window.location.href = 'index.html'; return; }

    setupPasswordToggles();

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'terms'];
        fields.forEach(clearFieldError);

        const firstName       = document.getElementById('firstName').value.trim();
        const lastName        = document.getElementById('lastName').value.trim();
        const email           = document.getElementById('email').value.trim();
        const phone           = document.getElementById('phone').value.trim();
        const password        = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms           = document.getElementById('terms').checked;
        const newsletter      = document.getElementById('newsletter').checked;

        let isValid = true;

        if (!firstName) { showFieldError('firstName', 'First name is required'); isValid = false; }
        if (!lastName)  { showFieldError('lastName',  'Last name is required');  isValid = false; }

        if (!email) {
            showFieldError('email', 'Email is required'); isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address'); isValid = false;
        } else if (findAccount(email)) {
            showFieldError('email', 'An account with this email already exists. Please log in.'); isValid = false;
        }

        if (!phone) {
            showFieldError('phone', 'Phone number is required'); isValid = false;
        } else if (!isValidPhone(phone)) {
            showFieldError('phone', 'Please enter a valid phone number'); isValid = false;
        }

        if (!password) {
            showFieldError('password', 'Password is required'); isValid = false;
        } else if (!isValidPassword(password)) {
            showFieldError('password', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'); isValid = false;
        }

        if (!confirmPassword) {
            showFieldError('confirmPassword', 'Please confirm your password'); isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match'); isValid = false;
        }

        if (!terms) { showFieldError('terms', 'You must agree to the Terms & Conditions'); isValid = false; }

        if (!isValid) return;

        const userData = { id: Date.now(), firstName, lastName, email, phone, newsletter };
        saveAccount(userData, password);
        saveSession(userData);
        window.location.href = 'index.html';
    });

    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function () {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else { clearFieldError('email'); }
        });
    }

    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('blur', function () {
            if (this.value && !isValidPassword(this.value)) {
                showFieldError('password', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
            } else { clearFieldError('password'); }
        });
    }

    const confirmPasswordField = document.getElementById('confirmPassword');
    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('blur', function () {
            const pwd = document.getElementById('password').value;
            if (this.value && this.value !== pwd) {
                showFieldError('confirmPassword', 'Passwords do not match');
            } else { clearFieldError('confirmPassword'); }
        });
    }
}

// ─── Password toggle ──────────────────────────────────────────────────────────

function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const input   = this.parentElement.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.textContent = '👁️‍🗨️';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                eyeIcon.textContent = '👁️';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
}

// ─── Public helpers ───────────────────────────────────────────────────────────

function getCurrentUser() { return currentUser; }
function isLoggedIn()     { return currentUser !== null; }

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    initAuth();
    initLoginPage();
    initSignupPage();
});