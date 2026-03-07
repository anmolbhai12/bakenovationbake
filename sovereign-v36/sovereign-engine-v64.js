// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Initial Page Load Animations
document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notification-container');




    function showAlert(message, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = 'notification';

        notification.innerHTML = `
            <div class="notification-icon">${type === 'success' ? '✨' : 'ℹ️'}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;

        container.appendChild(notification);

        // Snappy animation entrance
        requestAnimationFrame(() => {
            notification.classList.add('active');
        });

        // Auto-dismiss logic
        const autoDismiss = setTimeout(() => {
            dismissNotification(notification);
        }, 5000);

        // Manual Close
        notification.querySelector('.notification-close').onclick = () => {
            clearTimeout(autoDismiss);
            dismissNotification(notification);
        };
    }

    function dismissNotification(el) {
        el.classList.remove('active');
        // Wait for CSS transition before removal
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 500);
    }

    // Hero Animations
    const tl = gsap.timeline();

    tl.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from('.reveal-text', {
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.floating-cake', {
            x: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        }, '-=1');

    // Floating animation for the cake
    gsap.to('.floating-cake', {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // --- SCROLL ANIMATIONS ---
    gsap.utils.toArray('.reveal-on-scroll').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // --- MODAL LOGIC & DATA TRANSFER ---
    const modal = document.getElementById('order-modal');
    const modalClose = document.querySelector('.modal-close');
    let orderForm = null;
    if (modal) orderForm = modal.querySelector('form');

    // --- GATED ORDERING LOGIC ---
    function checkLoginAndProceed(callback) {
        if (activeUser) {
            callback();
        } else {
            // Save intent
            window.pendingAction = callback;
            authModal.classList.add('active');
            showAlert("Please login or create an account to proceed with your order.");
        }
    }

    // --- USER AUTHENTICATION LOGIC ---
    const authModal = document.getElementById('auth-modal');
    const authClose = document.querySelector('.auth-close');
    const loginTrigger = document.getElementById('login-trigger');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const otpView = document.getElementById('otp-view');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');
    const otpInput = document.getElementById('otp-input');
    const userNavArea = document.getElementById('user-nav-area');

    // Unified Google Apps Script URL
    const UNIFIED_GAS_URL = 'https://script.google.com/macros/s/AKfycbyv7eEYzqfIMvilVARvzNFKqhFHr6zyF8ZvY3v4_3HRaj-P38aOMKaaYeFtDLQK2aCb/exec';

    const EMAIL_PROXY_URL = UNIFIED_GAS_URL;
    const EMAIL_SIGNUP_SHEET_URL = UNIFIED_GAS_URL;
    const ORDER_SHEET_URL = UNIFIED_GAS_URL;
    const WHATSAPP_SIGNUP_SHEET_URL = UNIFIED_GAS_URL;
    const WHATSAPP_PROXY_URL = UNIFIED_GAS_URL;



    let users = [];
    let activeUser = null;
    try {
        users = JSON.parse(localStorage.getItem('bakenovation_users')) || [];
        activeUser = JSON.parse(localStorage.getItem('bakenovation_activeUser')) || null;
    } catch (e) {
        console.error("Storage corruption detected, resetting session.");
        localStorage.removeItem('bakenovation_activeUser');
    }
    let currentSignupData = null;
    let generatedOTP = null;
    let currentLoginMethod = 'email'; // 'email' or 'whatsapp'
    let currentSignupMethod = 'email'; // 'email' or 'whatsapp'

    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');

    // --- LOGIN METHOD TOGGLE ---
    const toggleLoginMethod = document.getElementById('toggle-login-method');
    const loginEmailGroup = document.getElementById('login-email-group');
    const loginwhatsappGroup = document.getElementById('login-whatsapp-group');
    const loginMethodText = document.getElementById('login-method-text');

    if (toggleLoginMethod) {
        toggleLoginMethod.addEventListener('click', () => {
            if (currentLoginMethod === 'email') {
                currentLoginMethod = 'whatsapp';
                loginEmailGroup.style.display = 'none';
                loginwhatsappGroup.style.display = 'block';
                toggleLoginMethod.innerText = 'Login with Email instead';
                if (loginMethodText) loginMethodText.innerText = 'Login via WhatsApp OTP';
            } else {
                currentLoginMethod = 'email';
                loginEmailGroup.style.display = 'block';
                loginwhatsappGroup.style.display = 'none';
                toggleLoginMethod.innerText = 'Login with WhatsApp instead';
                if (loginMethodText) loginMethodText.innerText = 'Login via Email OTP';
            }
        });
    }

    // --- SIGNUP METHOD TOGGLE ---
    const toggleSignupMethod = document.getElementById('toggle-signup-method');
    const signupEmailGroup = document.getElementById('signup-email-group');
    const signupwhatsappGroup = document.getElementById('signup-whatsapp-group');
    const signupMethodText = document.getElementById('signup-method-text');

    if (toggleSignupMethod) {
        toggleSignupMethod.addEventListener('click', () => {
            if (currentSignupMethod === 'email') {
                currentSignupMethod = 'whatsapp';
                signupEmailGroup.style.display = 'none';
                signupwhatsappGroup.style.display = 'block';
                toggleSignupMethod.innerText = 'Sign up with Email instead';
                if (signupMethodText) signupMethodText.innerText = 'Sign up via WhatsApp OTP';
            } else {
                currentSignupMethod = 'email';
                signupEmailGroup.style.display = 'block';
                signupwhatsappGroup.style.display = 'none';
                toggleSignupMethod.innerText = 'Sign up with WhatsApp instead';
                if (signupMethodText) signupMethodText.innerText = 'Sign up via Email OTP';
            }
        });
    }

    function updateAuthUI() {
        if (!userNavArea) return;

        if (activeUser) {
            const firstName = activeUser.name.split(' ')[0];
            const initial = firstName.charAt(0).toUpperCase();
            userNavArea.innerHTML = `
                <div class="user-nav-area">
                    <div class="user-profile-nav" id="profile-toggle">
                        <div class="user-avatar-circle">${initial}</div>
                        <span class="user-name-abbr">${firstName}</span>
                    </div>
                    <div class="account-menu-dropdown" id="account-menu">
                        <div class="account-menu-item" id="logout-btn">Logout</div>
                    </div>
                </div>
            `;

            const profileToggle = document.getElementById('profile-toggle');
            const accountMenu = document.getElementById('account-menu');
            if (profileToggle && accountMenu) {
                profileToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = accountMenu.style.display === 'block';
                    accountMenu.style.display = isVisible ? 'none' : 'block';
                });
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    activeUser = null;
                    localStorage.removeItem('bakenovation_activeUser');
                    updateAuthUI();
                });
            }

            // Auto-fill order details
            const orderNameInput = document.querySelector('input[name="name"]');
            const orderEmailInput = document.querySelector('input[name="email"]');
            const orderPhoneInput = document.querySelector('input[name="phone"]');
            if (orderNameInput) orderNameInput.value = activeUser.name;
            if (orderEmailInput) orderEmailInput.value = activeUser.email;
            if (orderPhoneInput) orderPhoneInput.value = activeUser.whatsapp || activeUser.phone || '';

            // Execute pending action if any
            if (window.pendingAction) {
                const action = window.pendingAction;
                window.pendingAction = null;
                action();
            }

        } else {
            userNavArea.innerHTML = `<button id="login-trigger" class="btn-text" style="color: var(--color-orchid);">Login</button>`;
            const newLoginTrigger = document.getElementById('login-trigger');
            newLoginTrigger.addEventListener('click', () => {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    }

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            signupView.style.display = 'block';
            otpView.style.display = 'none';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupView.style.display = 'none';
            loginView.style.display = 'block';
            otpView.style.display = 'none';
        });
    }

    if (authClose) {
        authClose.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Reset to default state after transition
            setTimeout(() => {
                if (otpView) otpView.style.display = 'none';
                if (signupView) signupView.style.display = 'none';
                if (loginView) loginView.style.display = 'block';
                currentSignupData = null;
                generatedOTP = null;
            }, 300);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const dob = document.getElementById('signup-dob').value;
            let target = '';

            if (currentSignupMethod === 'email') {
                target = document.getElementById('signup-email').value.trim();
            } else {
                target = document.getElementById('signup-whatsapp').value.trim();
            }

            if (!target) return showAlert("Please enter your email or phone.");

            signupSubmitBtn.innerText = "Checking...";
            signupSubmitBtn.disabled = true;

            // BACKEND VERIFICATION FIRST
            fetch(`${UNIFIED_GAS_URL}?action=check_user&identifier=${encodeURIComponent(target)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.exists) {
                        showAlert('An account already exists with this information. Please login instead.');
                    } else {
                        currentSignupData = {
                            name,
                            email: currentSignupMethod === 'email' ? target : '',
                            whatsapp: currentSignupMethod === 'whatsapp' ? target : '',
                            dob
                        };
                        window.lastSignupData = currentSignupData;
                        sendOTP(name, target, dob, currentSignupMethod);
                    }
                })
                .catch(() => {
                    showAlert("Authentication service temporary unavailable. Please try again.");
                    signupSubmitBtn.innerText = "Send Verification Code";
                    signupSubmitBtn.disabled = false;
                });
            // REMOVED finally re-enable to prevent double-click during OTP generation
        });
    }

    // --- REUSABLE OTP SENDING FUNCTION ---
    function sendOTP(name, target, extra, method = 'email') {
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`%c[AUTH] Secure Code Generated: ${generatedOTP}`, 'color: #d4af37; font-weight: bold;');
        const otpTitle = document.getElementById('otp-title');
        const otpMessage = document.getElementById('otp-message');

        const submitBtn = document.getElementById(`${signupView.style.display !== 'none' ? 'signup' : 'login'}-submit-btn`);
        const originalBtnText = submitBtn ? submitBtn.innerText : "Send Code";

        if (submitBtn) {
            submitBtn.innerText = "Sending Code...";
            submitBtn.disabled = true;
        }

        if (method === 'email') {
            const templateParams = {
                user_name: name,
                user_email: target,
                otp_code: generatedOTP,
                to_email: target
            };

            syncToGoogleSheet(Object.assign(templateParams, { action: 'send_email_otp' }), EMAIL_PROXY_URL)
                .then(() => {
                    showOTPView("Verify Email", `We've sent a code to ${target}`);
                })
                .catch(err => {
                    console.error("Email Proxy Error:", err);
                    showAlert(`Failed to send email. For demo, OTP is: ${generatedOTP}`);
                    showOTPView("Verify Email", `We've sent a code to ${target}`);
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }
                });
        } else if (method === 'whatsapp') {
            // Advanced Phone Sanitization
            let cleanNumber = target.replace(/\D/g, '');
            if (cleanNumber.startsWith('0')) cleanNumber = cleanNumber.substring(1);
            if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

            const message = `*Bakenovation - Verification Code*\n\nHello ${name || 'User'}! ✨\n\nYour security code is: *${generatedOTP}*\n\nThis code is valid for 10 minutes.\n\nThank you for choosing Bakenovation!`;
            const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

            console.log("--- WHATSAPP DISPATCH (POWER-SYNC) ---");
            console.log("Target Number:", target);
            console.log("Proxy URL:", WHATSAPP_PROXY_URL);

            if (submitBtn) submitBtn.innerText = "Dispatching Code...";

            // Use Power-Sync (Form/Iframe POST) to bypass CORS entirely
            syncToGoogleSheet({
                phone: cleanNumber,
                message: message,
                action: 'send_whatsapp_otp'
            }, WHATSAPP_PROXY_URL)
                .then(() => {
                    console.log("✅ OTP Dispatch Signal Sent");
                    let displayNum = cleanNumber.length >= 10 ? `+${cleanNumber.startsWith('91') ? '91 ' : ''}${cleanNumber.slice(-10)}` : target;
                    let otpMsg = `<div style="padding: 1rem 0;">
                    <p style="margin-bottom: 0.5rem; font-weight: 500;">✅ Code Dispatched</p>
                    <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.4;">
                        A verification code is being sent to <strong>${displayNum}</strong> via WhatsApp.
                    </p>
                    <p style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">
                        Please check your phone. If it doesn't arrive in 30 seconds, try manual verification below.
                    </p>
                    <div style="margin-top: 1.5rem;">
                        <a href="${waLink}" target="_blank" class="btn-luxury btn-sm" style="display: inline-block; text-decoration: none; padding: 0.6rem 1.2rem; background: rgba(223, 197, 254, 0.1); color: var(--color-orchid); border: 1px solid var(--color-orchid); border-radius: 8px; font-size: 0.8rem;">Didn't receive it? Send manually</a>
                    </div>
                </div>`;
                    showOTPView("Verify Identity", otpMsg, true);
                })
                .catch(err => {
                    console.error("❌ Dispatch Error:", err);
                    let otpMsg = `<div style="padding: 1rem 0;">
                    <p style="margin-bottom: 0.5rem; font-weight: 500; color: #e74c3c;">⚠️ Dispatch Issue</p>
                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                        We couldn't trigger the automatic send. Please use manual verification:
                    </p>
                    <a href="${waLink}" target="_blank" class="btn-luxury btn-sm" style="display: inline-block; text-decoration: none; padding: 0.75rem 1.5rem; background: var(--color-orchid); color: white; border-radius: 8px; font-weight: 600;">Verify via WhatsApp</a>
                </div>`;
                    showOTPView("Verify Identity", otpMsg, true);
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }
                });
        }
    }

    function showOTPView(title, message, isHTML = false) {
        signupView.style.display = 'none';
        loginView.style.display = 'none';
        otpView.style.display = 'block';
        if (document.getElementById('otp-title')) document.getElementById('otp-title').innerText = title;

        const msgEl = document.getElementById('otp-message');
        if (msgEl) {
            if (isHTML) msgEl.innerHTML = message;
            else msgEl.innerText = message;
        }
        startResendCooldown();
    }

    // --- RESEND OTP LOGIC ---
    const resendBtn = document.getElementById('resend-otp');
    let resendCooldownActive = false;

    function startResendCooldown() {
        if (!resendBtn) return;

        resendCooldownActive = true;
        resendBtn.style.pointerEvents = 'none';
        resendBtn.style.opacity = '0.5';

        let seconds = 60;
        const interval = setInterval(() => {
            seconds--;
            resendBtn.innerText = `Resend Code (${seconds}s)`;

            if (seconds <= 0) {
                clearInterval(interval);
                resendCooldownActive = false;
                resendBtn.style.pointerEvents = 'auto';
                resendBtn.style.opacity = '1';
                resendBtn.innerText = "Resend Code";
            }
        }, 1000);
    }

    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (resendCooldownActive) return;

            if (window.lastSignupData) {
                const target = currentSignupMethod === 'email' ? window.lastSignupData.email : window.lastSignupData.whatsapp;
                sendOTP(window.lastSignupData.name, target, window.lastSignupData.dob, currentSignupMethod);
            } else {
                const identifier = currentLoginMethod === 'email' ? document.getElementById('login-email').value.trim() : document.getElementById('login-whatsapp').value.trim();
                const user = users.find(u => u.email === identifier || u.whatsapp === identifier);
                sendOTP(user ? user.name : 'User', identifier, null, currentLoginMethod);
            }
        });
    }

    const backToAuthBtn = document.getElementById('back-to-auth');
    if (backToAuthBtn) {
        backToAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            otpView.style.display = 'none';
            if (currentSignupData || window.lastSignupData) {
                signupView.style.display = 'block';
            } else {
                loginView.style.display = 'block';
            }
            // Clear temporary data to allow re-entry
            currentSignupData = null;
            generatedOTP = null;
        });
    }

    if (otpForm) {
        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (otpInput.value === generatedOTP) {
                const isSignup = !!currentSignupData;

                if (isSignup) {
                    users.push(currentSignupData);
                    localStorage.setItem('bakenovation_users', JSON.stringify(users));
                    activeUser = currentSignupData;
                } else {
                    const identifier = currentLoginMethod === 'email' ? document.getElementById('login-email').value.trim() : document.getElementById('login-whatsapp').value.trim();
                    activeUser = users.find(u => u.email === identifier || u.whatsapp === identifier);
                    if (!activeUser) {
                        // Fallback in case local storage was cleared
                        activeUser = { name: "Valued Member", email: currentLoginMethod === 'email' ? identifier : '', whatsapp: currentLoginMethod === 'whatsapp' ? identifier : '' };
                    }
                }

                localStorage.setItem('bakenovation_activeUser', JSON.stringify(activeUser));

                // SYNC TO SHEETS (Signup or Login)
                const syncData = {
                    name: activeUser.name,
                    identifier: activeUser.whatsapp || activeUser.email,
                    dob: activeUser.dob || (isSignup ? "New Member" : ""),
                    method: activeUser.whatsapp ? 'whatsapp' : 'email',
                    type: isSignup ? 'Signup' : 'Login',
                    action: isSignup ? 'sync_signup' : 'sync_login'
                };

                syncToGoogleSheet(syncData)
                    .then(() => {
                        currentSignupData = null; // Clear now
                        authModal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        updateAuthUI();
                        showAlert(`Verified! Welcome, ${activeUser.name}!`, 'success');
                    })
                    .catch(() => {
                        currentSignupData = null;
                        authModal.classList.remove('active');
                        updateAuthUI();
                    });
            } else {
                showAlert("Invalid verification code. Please try again.");
            }
        });
    }

    // --- GOOGLE SHEETS SYNC FUNCTION (FETCH-SYNC V4) ---
    function syncToGoogleSheet(data, targetUrl = null) {
        const urlRequest = targetUrl || UNIFIED_GAS_URL;
        if (!urlRequest) return Promise.resolve();

        // Ensure method casing for backend compatibility
        if (data.method) data.method = data.method.toLowerCase();

        return fetch(urlRequest, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.warn("Sync fetch error:", err));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = currentLoginMethod === 'email' ? document.getElementById('login-email').value.trim() : document.getElementById('login-whatsapp').value.trim();

            if (!identifier) return showAlert("Please enter your identifier.");

            loginSubmitBtn.innerText = "Verifying...";
            loginSubmitBtn.disabled = true;

            // BACKEND VERIFICATION FIRST
            fetch(`${UNIFIED_GAS_URL}?action=check_user&identifier=${encodeURIComponent(identifier)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.exists) {
                        // User exists in registry, proceed to OTP
                        sendOTP(data.name || 'User', identifier, null, currentLoginMethod);
                        // Also sync local storage if not already there
                        if (!users.find(u => u.email === identifier || u.whatsapp === identifier)) {
                            users.push({ name: data.name, email: data.method === 'email' ? identifier : '', whatsapp: data.method === 'whatsapp' ? identifier : '', dob: data.dob });
                            localStorage.setItem('bakenovation_users', JSON.stringify(users));
                        }
                    } else {
                        showAlert(`No account found. Please sign up first.`);
                    }
                })
                .catch(() => {
                    showAlert("Authentication service unavailable.");
                    loginSubmitBtn.innerText = "Send Login Code";
                    loginSubmitBtn.disabled = false;
                })
            // REMOVED finally re-enable to prevent double-click during OTP generation
        });
    }

    updateAuthUI();


    // --- CONSOLIDATED ORDER FORM HANDLER V35 ---
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = orderForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "🔄 Processing Sovereign Order...";
            btn.disabled = true;

            const formData = new FormData(this);
            const orderData = {};
            formData.forEach((value, key) => {
                if (typeof value === 'string') orderData[key] = value;
            });
            orderData.action = 'create_order';

            // ATTACHMENT HANDLING
            const mainUpload = document.getElementById('main-upload');
            if (mainUpload && mainUpload.files.length > 0) {
                formData.set('attachment', mainUpload.files[0]);
            }

            // Sync to Unified Sheets + Gmail
            syncToGoogleSheet(orderData, UNIFIED_GAS_URL)
                .then(() => {
                    btn.innerText = "🚀 Finalizing...";
                    console.log("Sovereign Order Synced");
                    return fetch(UNIFIED_GAS_URL, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                })
                .then(() => {
                    localStorage.removeItem('bakenovation_cart');
                    showAlert("Order Placed Successfully! We will reach out shortly.", 'success');
                    setTimeout(() => window.location.href = 'success.html', 1500);
                })
                .catch(error => {
                    console.error("Order Error:", error);
                    showAlert('Sync slow. Please contact us if you don\'t hear back.');
                    setTimeout(() => window.location.href = 'success.html', 2000);
                });
        });
    }

    // --- SHOPPING CART LOGIC ---
    let cart = JSON.parse(localStorage.getItem('bakenovation_cart')) || [];
    const cartDrawer = document.getElementById('cart-drawer');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    function updateCartUI() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-details">${item.details || ''}</p>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        if (cartCountBadge) cartCountBadge.innerText = cart.length;

        // Add remove listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('bakenovation_cart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    function addToCart(item) {
        cart.push(item);
        localStorage.setItem('bakenovation_cart', JSON.stringify(cart));
        updateCartUI();

        // Open drawer to show success
        if (cartDrawer) cartDrawer.classList.add('active');
    }

    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.add('active');
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.remove('active');
        });
    }

    // Close cart on outside click
    if (cartDrawer) {
        cartDrawer.addEventListener('click', (e) => {
            if (e.target === cartDrawer) cartDrawer.classList.remove('active');
        });
    }

    // Checkout button logic (GATED)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showAlert('Your cart is empty!');
                return;
            }

            checkLoginAndProceed(() => {
                if (cartDrawer) cartDrawer.classList.remove('active');
                if (modal) modal.classList.add('active');

                const cartSummary = cart.map(item => `- ${item.name} (${item.details})`).join('\n');
                const imageRefs = cart.map(item => `${item.name}:\n${item.image}`).join('\n\n');

                const messageInput = modal.querySelector('textarea[name="message"]');
                const imageRefsInput = document.getElementById('modal-image-references');

                if (messageInput) {
                    messageInput.value = `[SHOPPING CART ORDER]\n${cartSummary}\n\n[IMAGE REFERENCES]\n${imageRefs}\n\nClient Name: ${activeUser?.name || 'User'}`;
                }
                if (imageRefsInput) {
                    imageRefsInput.value = imageRefs;
                }
            });
        });
    }

    // Initial UI load
    updateCartUI();

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // --- VIEW MORE LOGIC ---
    const viewMoreBtn = document.getElementById('view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-item');
            hiddenItems.forEach((item, index) => {
                item.style.display = 'block';
                // Animate them in
                gsap.from(item, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    delay: index * 0.1
                });
            });
            viewMoreBtn.style.display = 'none'; // Hide button after expanding
        });
    }

    // AI Buy Now Button Logic
    const aiBuyNowBtn = document.getElementById('ai-buy-now-btn');
    if (aiBuyNowBtn) {
        aiBuyNowBtn.addEventListener('click', () => {
            if (aiPrompt) {
                const userDetails = aiPrompt.value.trim();
                const smartDetails = `Flavor: ${snapState.flavor}, Size: ${snapState.size}. Prompt: ${userDetails}`;

                checkLoginAndProceed(() => {
                    // Open the formal order modal with AI context
                    if (modal) {
                        const flavorInput = modal.querySelector('#modal-flavor');
                        const weightInput = modal.querySelector('#modal-tiers');
                        const msgInput = modal.querySelector('#order-message');
                        const imgInput = modal.querySelector('#modal-img');
                        const dateInput = modal.querySelector('#modal-date');

                        if (flavorInput) flavorInput.value = snapState.flavor;
                        if (weightInput) weightInput.value = snapState.size;
                        if (msgInput) msgInput.value = userDetails; // Keep user prompt separate
                        if (imgInput) imgInput.value = snapState.currentImageUrl;

                        // Set minimum 2 days for date input
                        if (dateInput) {
                            const today = new Date();
                            const minDate = new Date(today);
                            minDate.setDate(today.getDate() + 2);
                            const yyyy = minDate.getFullYear();
                            const mm = String(minDate.getMonth() + 1).padStart(2, '0');
                            const dd = String(minDate.getDate()).padStart(2, '0');
                            dateInput.min = `${yyyy}-${mm}-${dd}`;
                            dateInput.value = `${yyyy}-${mm}-${dd}`;
                        }

                        modal.classList.add('active');
                    }
                });
            }
        });
    }

    // --- CAKE DETAIL MODAL LOGIC REMOVED FOR DEDICATED PAGES ---
    // (Legacy modal code removed as we now use product.html)

    // AI Add to Cart Button Logic
    const aiAddToCartBtn = document.getElementById('ai-add-to-cart-btn');
    if (aiAddToCartBtn) {
        aiAddToCartBtn.addEventListener('click', () => {
            if (aiPrompt) {
                const userDetails = aiPrompt.value.trim();
                const smartPrompt = `${snapState.type} cake, ${snapState.style} style, ${snapState.color} color palette. ${userDetails}`;

                addToCart({
                    name: 'Bespoke AI Design',
                    image: snapState.currentImageUrl,
                    details: smartPrompt,
                    price: 4500 // Prestige tier for AI designs
                });
            }
        });
    }

    // --- AI DESIGN STUDIO LOGIC (SWEET SNAP REPLICA) ---
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiPrompt = document.getElementById('ai-prompt');
    const aiLoading = document.getElementById('ai-loading');
    const aiGeneratedImage = document.getElementById('ai-generated-image');
    const aiOrderBtn = document.getElementById('ai-order-btn');

    // State Management for Sweet Snap
    const snapState = {
        type: 'wedding',
        style: 'luxury',
        color: 'white',
        flavor: 'chocolate', // Default flavor
        size: '1kg', // Default weight
        currentImageUrl: 'assets/wedding_cake.png'
    };

    // 1. Handle Chip Selections (Occasion, Aesthetic)
    const snapChips = document.querySelectorAll('.snap-chip');
    snapChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Determine group based on data attribute
            const group = chip.parentElement;

            // Remove active from siblings in the same group
            group.querySelectorAll('.snap-chip').forEach(c => c.classList.remove('active'));

            // Activate clicked chip
            chip.classList.add('active');

            // Update State
            if (chip.dataset.type) snapState.type = chip.dataset.type;
            if (chip.dataset.style) snapState.style = chip.dataset.style;
            if (chip.dataset.flavor) snapState.flavor = chip.dataset.flavor;
            if (chip.dataset.size) snapState.size = chip.dataset.size;
        });
    });

    // 2. Handle Color Selection
    const snapColors = document.querySelectorAll('.snap-color');
    snapColors.forEach(color => {
        color.addEventListener('click', () => {
            // Remove active from all colors
            snapColors.forEach(c => c.classList.remove('active'));

            // Activate clicked
            color.classList.add('active');

            // Update State
            if (color.dataset.color) snapState.color = color.dataset.color;
        });
    });

    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', () => {
            // Popup Disclaimer
            showAlert("*Note: AI designs are for visual inspiration. Actual taste, texture and final design may vary slightly as each cake is uniquely handcrafted.", 'info');

            const btnText = aiGenerateBtn.querySelector('.btn-text');
            const spinner = aiGenerateBtn.querySelector('.spinner');
            const loadingMsg = aiLoading ? aiLoading.querySelector('p') : null;
            const originalLoadingMsg = "Chef is sketching your masterpiece...";

            const startSovereignEngineV38 = async () => {
                const btnText = aiGenerateBtn.querySelector('.btn-text');
                const spinner = aiGenerateBtn.querySelector('.spinner');
                const loadingMsg = aiLoading ? aiLoading.querySelector('p') : null;

                if (!aiPrompt) {
                    console.error("AI Prompt input field missing from DOM.");
                    return;
                }

                const rawUserText = aiPrompt.value.trim();
                const loadingText = rawUserText ? "⚡ Sculpting your custom vision..." : "Chef is sketching a masterpiece...";

                if (btnText) btnText.style.display = 'none';
                if (spinner) spinner.style.display = 'block';
                aiGenerateBtn.disabled = true;
                if (aiLoading) {
                    aiLoading.style.display = 'flex';
                    aiLoading.style.background = 'rgba(26, 11, 31, 0.95)';
                    aiLoading.style.backdropFilter = 'blur(5px)';
                    aiLoading.style.pointerEvents = 'auto';
                    const loadingMsgText = aiLoading.querySelector('p');
                    if (loadingMsgText) loadingMsgText.style.display = 'block';
                }
                if (loadingMsg) loadingMsg.innerText = loadingText;

                if (aiGeneratedImage) {
                    aiGeneratedImage.classList.add('sketching');
                }

                // === POLLINATIONS AI ENGINE V9 (TURBO) ===
                // Pollinations is our primary engine for fast, reliable cake design.
                const imageSeed = Math.floor(Math.random() * 9999999);

                const expandPrompt = (input) => {
                    const style = snapState.style;
                    const occasion = snapState.type;
                    const flavor = snapState.flavor;
                    const size = snapState.size;

                    // SD best practice: most important thing FIRST, use () for emphasis
                    if (input) {
                        const subject = input.toLowerCase().includes('cake') ? input : `${input} shaped cake`;
                        return `${subject}, ${style} style, ${occasion}, ${flavor} flavored, ${size} cake, luxury couture bakery, hyperrealistic food photography, studio lighting, 8k, sharp focus, clean white background`;
                    }
                    return `${style} ${occasion} cake, ${flavor} flavored, ${size}, luxury couture bakery, hyperrealistic food photography, studio lighting, 8k, bokeh, sharp focus`;
                };

                // Expand and generate via Pollinations AI

                const renderFinalImage = (srcData) => {
                    if (aiGeneratedImage) {
                        snapState.currentImageUrl = srcData;
                        // Avoid infinite loop: only set src if it's different
                        if (aiGeneratedImage.src !== srcData) {
                            aiGeneratedImage.src = srcData;
                        }
                        aiGeneratedImage.classList.remove('sketching');
                        addToGallery(srcData, "AI Generated Masterpiece");
                        gsap.fromTo(aiGeneratedImage,
                            { opacity: 0, scale: 0.98, filter: "blur(15px)" },
                            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
                        );
                        resetLoadingState();
                    }
                };

                const resetLoadingState = () => {
                    // Show Artisanal Agreement Modal after generation
                    const artisanalModal = document.getElementById('artisanal-modal');
                    if (artisanalModal) {
                        artisanalModal.style.display = 'flex';
                    }

                    // Persistent Buffering until "Agree" is clicked
                    if (aiLoading) {
                        const loadingMsgText = aiLoading.querySelector('p');
                        if (loadingMsgText) loadingMsgText.style.display = 'none';
                        aiLoading.style.background = 'transparent';
                        aiLoading.style.backdropFilter = 'none';
                        aiLoading.style.pointerEvents = 'none';
                    }

                    if (aiGenerateBtn) aiGenerateBtn.disabled = false;
                    if (btnText) btnText.style.display = 'block';
                    if (spinner) spinner.style.display = 'none';

                    // Show result actions (Add to Cart / Buy Now)
                    const resultActions = document.getElementById('ai-result-actions');
                    if (resultActions) {
                        resultActions.style.display = 'flex';
                    }
                };

                // === POLLINATIONS AI ENGINE — DIRECT FLUX V9 ===
                // Pollinations provides high-speed, direct image generation.
                // We expand the prompt and append it to the Pollinations URL.
                const finalPrompt = expandPrompt(rawUserText);
                const encodedPrompt = encodeURIComponent(finalPrompt);
                // === GOOGLE IMAGEN 3 ENGINE — PROFESSIONAL V60 ===
                const tryGeneration = () => {
                    const finalPrompt = expandPrompt(rawUserText);
                    console.log(`%c🚀 GENERATING WITH UNIVERSAL UNBREAKABLE TUNNEL`, 'color:#4285F4; font-weight:bold; font-size: 1.2em;');
                    console.log('%cFinal Prompt:', 'color:#f5e4bc;', finalPrompt);

                    tryGasProxy(finalPrompt);
                };

                const tryGasProxy = (prompt) => {
                    const proxyUrl = UNIFIED_GAS_URL;

                    console.log(`%c📡 Establishing Secure Google AI Tunnel...`, 'color:#9b59b6;');

                    fetch(`${proxyUrl}?action=ai_proxy&prompt=${encodeURIComponent(prompt)}`)
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP ${response.status}`);
                            return response.json();
                        })
                        .then(data => {
                            if (data.status === 'success' && data.image_base64) {
                                console.log(`%c✅ Universal Tunnel Success!`, 'color:#2ecc71; font-weight:bold;');
                                const base64Url = `data:image/jpeg;base64,${data.image_base64}`;
                                renderFinalImage(base64Url);
                            } else {
                                const errorMsg = data.message || data.error || 'Google Engine Timeout';
                                throw new Error(errorMsg);
                            }
                        })
                        .catch(err => {
                            console.error('❌ Google AI Tunnel Failure:', err);
                            resetLoadingState();

                            let userError = 'AI Studio is currently experiencing high demand.';
                            if (err.message.includes('Unexpected token')) {
                                userError = 'Your Google Proxy script needs to be re-deployed. Please check your Apps Script!';
                            } else if (err.message.includes('Refused')) {
                                userError = 'Google AI refused the prompt. Please try a simpler description! 🎂';
                            }

                            showAlert(`${userError}`, 'warning');
                        });
                };

                tryGeneration();
            };

            startSovereignEngineV38();
        });
    }


    // Studio Add to Cart Logic (GATED)
    const detailAddToCartBtn = document.getElementById('detail-add-to-cart-btn');
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
            const absoluteImgSrc = detailImg.src.startsWith('http') ? detailImg.src : baseUrl + detailImg.src;

            addToCart({
                name: detailTitle.innerText,
                image: absoluteImgSrc,
                details: `Ingredients: ${detailIngredients.innerText.substring(0, 50)}...`,
                price: parseInt(detailWeight.innerText.replace(/\D/g, '')) * 1000 || 2500
            });
        });
    }

    const detailDirectOrderBtn = document.getElementById('detail-direct-order-btn');
    if (detailDirectOrderBtn) {
        detailDirectOrderBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            checkLoginAndProceed(() => {
                if (detailModal) detailModal.classList.remove('active');
                if (modal) modal.classList.add('active');

                const designName = detailTitle.innerText;
                const designDetails = `[DIRECT ORDER] ${designName}\nIngredients: ${detailIngredients.innerText}\nWeight: ${detailWeight.innerText}\nServings: ${detailServings.innerText}`;

                const designInput = document.getElementById('modal-ordered-design');
                const messageInput = modal.querySelector('textarea[name="message"]');

                if (designInput) designInput.value = designName;
                if (messageInput) {
                    messageInput.value = designDetails;
                }

                gsap.fromTo(modal.querySelector('.modal-content'),
                    { y: -50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4 }
                );
            });
        });
    }

    // 4. Order Button Logic (GATED)
    if (aiOrderBtn) {
        aiOrderBtn.addEventListener('click', () => {
            checkLoginAndProceed(() => {
                const userDetails = aiPrompt.value.trim();
                const smartPrompt = `${snapState.type} cake, ${snapState.style} style, ${snapState.color} color palette. ${userDetails}`;

                const orderModal = document.getElementById('order-modal');
                if (orderModal) {
                    orderModal.classList.add('active');

                    const designInput = document.getElementById('modal-ordered-design');
                    const messageInput = orderModal.querySelector('textarea[name="message"]');

                    if (designInput) designInput.value = `Bespoke AI Created Design`;
                    if (messageInput) {
                        messageInput.value = `[AI CONFIGURATION]\n${smartPrompt}\n(Refer to the design generated in the Atelier)`;
                    }

                    gsap.fromTo(orderModal.querySelector('.modal-content'),
                        { y: -50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.4 }
                    );
                }
            });
        });
    }

    // --- GALLERY LOGIC ---
    function addToGallery(url, prompt) {
        const galleryContainer = document.getElementById('recent-generations-grid');
        if (!galleryContainer) return;

        // Create item
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.opacity = '0';
        item.innerHTML = `
            <img src="${url}" alt="AI Concept">
            <div class="gallery-overlay">
                <button class="btn-sm btn-luxury use-this-btn">Use This</button>
            </div>
        `;

        // Add to start
        galleryContainer.prepend(item);

        // Animate appearance
        gsap.to(item, { opacity: 1, duration: 0.5 });

        // Use this button logic
        const useBtn = item.querySelector('.use-this-btn');
        useBtn.addEventListener('click', () => {
            if (aiGeneratedImage) {
                aiGeneratedImage.src = url;
                gsap.fromTo(aiGeneratedImage, { scale: 0.95, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.3 });
            }
            // Scroll back up to preview
            document.querySelector('.snap-result-frame').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // REMOVED DUPLICATE LISTENER

    // ===================================================
    // BAKENOVATION HEADER: Wire up all buttons
    // ===================================================

    // --- SEARCH BUTTON ---
    const searchModal = document.getElementById('search-modal');
    const searchTriggerBtn = document.getElementById('search-trigger-btn');
    const searchCloseButtons = document.querySelectorAll('.search-close');
    const searchForm = document.getElementById('search-form');
    const searchResults = document.getElementById('search-results');

    if (searchTriggerBtn && searchModal) {
        searchTriggerBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => {
                const inp = document.getElementById('search-input');
                if (inp) inp.focus();
            }, 100);
        });
    }
    searchCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (searchModal) searchModal.classList.remove('active');
        });
    });
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) searchModal.classList.remove('active');
        });
    }
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('search-input').value.toLowerCase().trim();
            if (searchResults) {
                searchResults.style.display = 'block';
                // Basic keyword matching to collection items
                const cakes = document.querySelectorAll('.collection-item, .cake-detail-card');
                let found = 0;
                cakes.forEach(cake => {
                    if (cake.textContent.toLowerCase().includes(query)) found++;
                });
                searchResults.innerHTML = found > 0
                    ? `<p style="color: var(--color-orchid);">${found} result(s) found. <a href="#collection" style="color: var(--color-orchid); text-decoration:underline;" class="search-close">View Collection</a></p>`
                    : `<p class="empty-cart-msg">No results for "<strong>${query}</strong>". Try browsing our <a href="#collection" style="color: var(--color-orchid);" class="search-close">Collection</a>.</p>`;
                // Re-bind close buttons after innerHTML update
                document.querySelectorAll('.search-close').forEach(b => {
                    b.addEventListener('click', () => { if (searchModal) searchModal.classList.remove('active'); });
                });
            }
        });
    }

    // --- WISHLIST BUTTON ---
    const wishlistModal = document.getElementById('wishlist-modal');
    const wishlistTrigger = document.getElementById('wishlist-trigger');
    const wishlistCloseButtons = document.querySelectorAll('.wishlist-close');

    if (wishlistTrigger && wishlistModal) {
        wishlistTrigger.addEventListener('click', () => {
            wishlistModal.classList.add('active');
        });
    }
    wishlistCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (wishlistModal) wishlistModal.classList.remove('active');
            // If "Explore Collection" is clicked, close and scroll
            window.location.hash = '#collection';
        });
    });
    if (wishlistModal) {
        wishlistModal.addEventListener('click', (e) => {
            if (e.target === wishlistModal) wishlistModal.classList.remove('active');
        });
    }

    // --- ORDER MODAL CLOSE LOGIC ---
    const orderModal = document.getElementById('order-modal');
    const orderCloseButtons = document.querySelectorAll('.order-close');
    orderCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (orderModal) orderModal.classList.remove('active');
        });
    });
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) orderModal.classList.remove('active');
        });
    }

    // --- AI ORDER FORM SUBMISSION ---
    orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderData = {
                title: 'Bespoke AI Design',
                price: '4500', // Prestige tier
                flavor: document.getElementById('modal-flavor').value,
                weight: document.getElementById('modal-tiers').value,
                diet: document.getElementById('modal-diet').value,
                date: document.getElementById('modal-date').value,
                time: document.getElementById('modal-time').value,
                message: document.getElementById('order-message').value,
                image: document.getElementById('modal-img').value,
                qty: 1
            };
            localStorage.setItem('pendingOrder', JSON.stringify(orderData));
            window.location.href = 'checkout.html';
        });
    }

    // --- ARTISANAL AGREEMENT MODAL LOGIC ---
    const artisanalModal = document.getElementById('artisanal-modal');
    const btnArtisanalAgree = document.getElementById('btn-artisanal-agree');
    const btnArtisanalCancel = document.getElementById('btn-artisanal-cancel');

    if (btnArtisanalAgree) {
        btnArtisanalAgree.addEventListener('click', () => {
            if (artisanalModal) artisanalModal.style.display = 'none';
            // Hide the buffering overlay finally
            const aiLoading = document.getElementById('ai-loading');
            if (aiLoading) aiLoading.style.display = 'none';
        });
    }

    if (btnArtisanalCancel) {
        btnArtisanalCancel.addEventListener('click', () => {
            if (artisanalModal) artisanalModal.style.display = 'none';
            // Also hide overlay for usability if they cancel
            const aiLoading = document.getElementById('ai-loading');
            if (aiLoading) aiLoading.style.display = 'none';
        });
    }

});
