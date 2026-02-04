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

    // Email OTP Proxy URL (Custom GAS Solution)
    const EMAIL_PROXY_URL = 'https://script.google.com/macros/s/AKfycbyFQwPQeSuRo3Et4QQ5jOO-00YUSIKM7yHHNYBkAEPkrdzx6_NL25C6vuIgK4KMXYizOg/exec';


    // Google Sheets Sync URL (Email Signups)
    const EMAIL_SIGNUP_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyA6r5M4ELZd0Xl5koe8tz86NJPDmE4_cRXoI-DJyvgL9iMmWuUmIjQZNSxqRfpqOoJ/exec';

    // Google Sheets Sync URL (Orders)
    const ORDER_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxLHaZ4ip3vOKo-XspoddJ1LkHSZdaSO0i59ONwbhA1qw564yupAZZkb6wxsA5xzOrPbw/exec'; // Paste your new Orders Sheet URL here

    // Google Sheets Sync URL (WhatsApp Signups)
    const WHATSAPP_SIGNUP_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxQthx6RV4kMMEhnwLDqfjXjA3xwW5H36rojXPANySSHuRV2GlhdWkYp7yR5udavXdoPw/exec'; // Paste your new WhatsApp Login Sheet URL here

    // WhatsApp Proxy URL (Automated OTP)
    const WHATSAPP_PROXY_URL = 'https://script.google.com/macros/s/AKfycbx7WjGrAo8YV1RCpJHCvPpPUVVjXWMXX0pfWcBAaRdcAWjBAqbeyF-myEYsrFcUWPsz/exec'; // Deployed Google Script URL



    let users = JSON.parse(localStorage.getItem('bakenovation_users')) || [];
    let activeUser = JSON.parse(localStorage.getItem('bakenovation_activeUser')) || null;
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
            userNavArea.innerHTML = `<button id="login-trigger" class="btn-text" style="color: var(--color-gold);">Login</button>`;
            const newLoginTrigger = document.getElementById('login-trigger');
            if (newLoginTrigger) {
                newLoginTrigger.addEventListener('click', () => {
                    authModal.classList.add('active');
                });
            }
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
            const name = document.getElementById('signup-name').value;
            const dob = document.getElementById('signup-dob').value;
            let target = '';

            if (currentSignupMethod === 'email') {
                target = document.getElementById('signup-email').value.trim();
                if (users.find(u => u.email === target)) {
                    showAlert('Account already exists with this email.');
                    return;
                }
            } else {
                target = document.getElementById('signup-whatsapp').value.trim();
                if (users.find(u => u.whatsapp === target)) {
                    showAlert('Account already exists with this WhatsApp number.');
                    return;
                }
            }

            currentSignupData = {
                name,
                email: currentSignupMethod === 'email' ? target : '',
                whatsapp: currentSignupMethod === 'whatsapp' ? target : '',
                dob
            };
            window.lastSignupData = currentSignupData;

            sendOTP(name, target, dob, currentSignupMethod);
        });
    }

    // --- REUSABLE OTP SENDING FUNCTION ---
    function sendOTP(name, target, extra, method = 'email') {
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
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

            syncToGoogleSheet(templateParams, EMAIL_PROXY_URL)
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

            // Use Power-Sync (Form/Iframe) to bypass CORS entirely
            syncToGoogleSheet({
                phone: cleanNumber,
                message: message
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
                        <a href="${waLink}" target="_blank" class="btn-luxury btn-sm" style="display: inline-block; text-decoration: none; padding: 0.6rem 1.2rem; background: rgba(212, 175, 55, 0.1); color: var(--color-gold); border: 1px solid var(--color-gold); border-radius: 8px; font-size: 0.8rem;">Didn't receive it? Send manually</a>
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
                    <a href="${waLink}" target="_blank" class="btn-luxury btn-sm" style="display: inline-block; text-decoration: none; padding: 0.75rem 1.5rem; background: var(--color-gold); color: #000; border-radius: 8px; font-weight: 600;">Verify via WhatsApp</a>
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
                    // Note: currentSignupData is kept until sync starts to ensure we have the context
                } else {
                    const identifier = currentLoginMethod === 'email' ? document.getElementById('login-email').value.trim() : document.getElementById('login-whatsapp').value.trim();
                    activeUser = users.find(u => u.email === identifier || u.whatsapp === identifier);
                }

                localStorage.setItem('bakenovation_activeUser', JSON.stringify(activeUser));

                // ONLY SYNC TO SHEETS IF NEW SIGNUP
                if (isSignup) {
                    const syncUrl = activeUser.whatsapp ? WHATSAPP_SIGNUP_SHEET_URL : EMAIL_SIGNUP_SHEET_URL;

                    syncToGoogleSheet({
                        name: activeUser.name,
                        identifier: activeUser.whatsapp || activeUser.email,
                        dob: activeUser.dob || "New Member",
                        method: activeUser.whatsapp ? 'WhatsApp' : 'Email',
                        type: 'Signup'
                    }, syncUrl)
                        .then(() => {
                            currentSignupData = null; // Clear now
                            authModal.classList.remove('active');
                            updateAuthUI();
                            showAlert(`Verified! Welcome to the Atelier, ${activeUser.name}!`, 'success');
                        })
                        .catch(err => {
                            console.error("Signup sync error:", err);
                            currentSignupData = null;
                            authModal.classList.remove('active');
                            updateAuthUI();
                            showAlert(`Welcome, ${activeUser.name}!`, 'success');
                        });
                } else {
                    // Just login, no spreadsheet sync
                    authModal.classList.remove('active');
                    updateAuthUI();
                    showAlert(`Welcome back, ${activeUser.name}!`, 'success');
                }
            } else {
                showAlert("Invalid verification code. Please try again.");
            }
        });
    }

    // --- GOOGLE SHEETS SYNC FUNCTION (POWER-SYNC V3) ---
    function syncToGoogleSheet(data, targetUrl = null) {
        const finalUrl = targetUrl || EMAIL_SIGNUP_SHEET_URL;
        if (!finalUrl) return Promise.resolve();

        return new Promise((resolve) => {
            console.log("--- POWER-SYNC DISPATCHING ---");
            const iframeName = 'sync_frame_' + Date.now();
            const iframe = document.createElement('iframe');
            iframe.name = iframeName;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const form = document.createElement('form');
            form.target = iframeName;
            form.action = finalUrl;
            form.method = 'POST';
            form.style.display = 'none';

            data.timestamp = new Date().toISOString();
            for (const key in data) {
                if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = data[key];
                    form.appendChild(input);
                }
            }

            document.body.appendChild(form);
            form.submit();

            setTimeout(() => {
                if (document.body.contains(form)) document.body.removeChild(form);
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
                console.log("--- POWER-SYNC DISPATCHED ---");
                resolve();
            }, 2500);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = currentLoginMethod === 'email' ? document.getElementById('login-email').value.trim() : document.getElementById('login-whatsapp').value.trim();

            const user = users.find(u =>
                currentLoginMethod === 'email' ? u.email === identifier : u.whatsapp === identifier
            );

            if (user) {
                sendOTP(user.name, identifier, null, currentLoginMethod);
            } else {
                showAlert(`No account found with this ${currentLoginMethod === 'email' ? 'email' : 'WhatsApp number'}. Please sign up first.`);
            }
        });
    }

    updateAuthUI();


    // Handle Form Submission with Custom Redirects
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = orderForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "🔄 Syncing with Bakery...";
            btn.disabled = true;

            const formData = new FormData(this);

            // Collect standalone image upload from the Atelier section
            const mainUpload = document.getElementById('main-upload');
            if (mainUpload && mainUpload.files.length > 0) {
                formData.set('attachment', mainUpload.files[0]);
            }

            // Sync with Google Sheets (Orders Sheet) - STRIP FILES FIRST
            const orderData = {};
            formData.forEach((value, key) => {
                if (typeof value === 'string') orderData[key] = value;
            });
            orderData.type = 'Order';

            // FORCE SEQUENCE: Sync to Sheets FIRST, then FormSubmit
            syncToGoogleSheet(orderData, ORDER_SHEET_URL)
                .then(() => {
                    btn.innerText = "🚀 Finishing Order...";
                    // Debug Confirmation
                    console.log("Sheet Sync Response Received");
                    return fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                })
                .then(response => {
                    localStorage.removeItem('bakenovation_cart');
                    showAlert("Order Confirmed & Recorded! Redirecting...", 'success');
                    window.location.href = 'success.html';
                })
                .catch(error => {
                    console.error("Full Order Flow Error:", error);
                    showAlert('CRITICAL: Sync slow or blocked. Redirecting manually.');
                    window.location.href = 'success.html';
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

    // --- CAKE DETAIL MODAL LOGIC ---
    const detailModal = document.getElementById('cake-detail-modal');
    const detailClose = document.querySelector('.detail-close');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const detailImg = document.getElementById('detail-img');
    const detailServings = document.getElementById('detail-servings');
    const detailWeight = document.getElementById('detail-weight');
    const detailIngredients = document.getElementById('detail-ingredients');
    const detailOrderBtn = document.getElementById('detail-order-btn');

    // DATA FOR CAKE DETAILS
    const cakeDetails = {
        'Midnight Silk': {
            ingredients: ['70% Belgian Dark Chocolate', 'Edible 24k Gold Leaf', 'Madagascan Vanilla Bean', 'Dark Cocoa Butter'],
            servings: '20-25 pax',
            weight: '3.5 kg',
            flavor: 'chocolate'
        },
        'Crimson Velvet': {
            ingredients: ['Review-Winning Cream Cheese', 'Dutch Processed Cocoa', 'Buttermilk Sponge', 'Fresh Raspberries'],
            servings: '15-18 pax',
            weight: '2.8 kg',
            flavor: 'red_velvet'
        },
        'Gilded Era': {
            ingredients: ['White Chocolate Ganache', 'Edible Flowers', 'Almond Flour', 'Tahitian Vanilla'],
            servings: '30-40 pax (Double Tier)',
            weight: '5.0 kg',
            flavor: 'vanilla'
        },
        'Royal Wedding': {
            ingredients: ['Fondant Icing', 'Sugar Paste Flowers', 'Fruit Cake Base', 'Marzipan Layer'],
            servings: '100+ pax',
            weight: '12.0 kg',
            flavor: 'vanilla'
        },
        'Abstract Art': {
            ingredients: ['Tempered Chocolate Shards', 'Blue Spirulina', 'Gold Dust', 'Lemon Curd Filling'],
            servings: '25-30 pax',
            weight: '4.2 kg',
            flavor: 'lemon'
        },
        'Rustic Charm': {
            ingredients: ['Fresh Seasonal Berries', 'Vanilla Buttercream', 'Lemon Zest', 'Organic Flour'],
            servings: '12-15 pax',
            weight: '2.5 kg',
            flavor: 'vanilla'
        }
    };

    const collectionItems = document.querySelectorAll('.collection-item');

    collectionItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h3').innerText;
            const desc = item.querySelector('p').innerText;
            const imgSrc = item.querySelector('img').src;
            const data = cakeDetails[title] || {
                ingredients: ['Premium Flour', 'Fresh Eggs'],
                servings: 'Custom',
                weight: 'Varies',
                flavor: 'vanilla'
            };

            // Populate Modal
            if (detailTitle) detailTitle.innerText = title;
            if (detailDesc) detailDesc.innerText = desc;
            if (detailImg) detailImg.src = imgSrc;
            if (detailServings) detailServings.innerText = data.servings;
            if (detailWeight) detailWeight.innerText = data.weight;

            // Populate Ingredients
            if (detailIngredients) {
                detailIngredients.innerHTML = '';
                data.ingredients.forEach(ing => {
                    const li = document.createElement('li');
                    li.innerText = `• ${ing}`;
                    li.style.marginBottom = '0.3rem';
                    detailIngredients.appendChild(li);
                });
            }

            // Store selected flavor for direct order
            if (detailOrderBtn) detailOrderBtn.dataset.flavor = data.flavor;

            // Open Modal
            if (detailModal) {
                detailModal.classList.add('active');
                gsap.fromTo(detailModal.querySelector('.modal-content'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4 }
                );
            }
        });
    });

    if (detailClose) {
        detailClose.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            if (detailModal) detailModal.classList.remove('active');
        });
    }

    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.remove('active');
        });
    }

    // AI Add to Cart Button Logic
    const aiAddToCartBtn = document.getElementById('ai-add-to-cart-btn');
    if (aiAddToCartBtn) {
        aiAddToCartBtn.addEventListener('click', () => {
            const userDetails = aiPrompt.value.trim();
            const smartPrompt = `${snapState.type} cake, ${snapState.style} style, ${snapState.color} color palette. ${userDetails}`;

            addToCart({
                name: 'Bespoke AI Design',
                image: snapState.currentImageUrl,
                details: smartPrompt,
                price: 4500 // Prestige tier for AI designs
            });
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

    // 3. Real AI Generation Logic
    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', () => {
            checkLoginAndProceed(() => {
                // UI Loading State
                const btnText = aiGenerateBtn.querySelector('.btn-text');
                const spinner = aiGenerateBtn.querySelector('.spinner');
                if (btnText) btnText.style.display = 'none';
                if (spinner) spinner.style.display = 'block';
                aiGenerateBtn.disabled = true;

                // Show Loading Overlay
                if (aiLoading) aiLoading.style.display = 'flex';

                // Construct Ultra-Fast, Highly Accurate Prompt for Pollinations AI
                const userDetails = aiPrompt.value.trim();

                // PRIORITY: User Details > Aesthetic > Color > Type
                const promptParts = [
                    userDetails,
                    `${snapState.style} aesthetic`,
                    `${snapState.color} theme`,
                    `${snapState.type} cake`
                ].filter(Boolean);

                const fastPrompt = `${promptParts.join(', ')}, professional food photography, 8k resolution, ultra-realistic, luxurious detailing, soft studio lighting, vibrant colors, white background`;

                const encodedPrompt = encodeURIComponent(fastPrompt);
                const seed = Math.floor(Math.random() * 10000000); // Larger seed range
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;

                console.log("Generating AI Image with optimized prompt:", fastPrompt);

                // Fetch and display
                if (aiGeneratedImage) {
                    // Pre-load the image
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        aiGeneratedImage.src = imageUrl;
                        snapState.currentImageUrl = imageUrl;

                        // Add to Recent Generations Gallery (Fixed variable name)
                        addToGallery(imageUrl, fastPrompt);

                        // Reveal with snappy animation
                        gsap.fromTo(aiGeneratedImage,
                            { opacity: 0, scale: 0.98, filter: "blur(10px)" },
                            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
                        );

                        // Reset UI
                        if (aiLoading) aiLoading.style.display = 'none';
                        if (btnText) btnText.style.display = 'inline';
                        if (spinner) spinner.style.display = 'none';
                        aiGenerateBtn.disabled = false;
                    };

                    tempImage.onerror = () => {
                        showAlert("The AI is currently busy. Please try again in a moment.");
                        if (aiLoading) aiLoading.style.display = 'none';
                        if (btnText) btnText.style.display = 'inline';
                        if (spinner) spinner.style.display = 'none';
                        aiGenerateBtn.disabled = false;
                    };

                    tempImage.src = imageUrl;
                }
            });
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

});
