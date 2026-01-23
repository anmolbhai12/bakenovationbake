// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Initial Page Load Animations
document.addEventListener('DOMContentLoaded', () => {

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

    // --- CUSTOMIZER LOGIC ---
    const shapeBtns = document.querySelectorAll('.shape-btn');
    const tierRange = document.getElementById('tier-range');
    const tierDisplay = document.getElementById('tier-display');
    const flavorSelect = document.getElementById('flavor-select');
    const previewCake = document.getElementById('preview-cake');
    const orderBtn = document.getElementById('order-btn');
    const fileInput = document.getElementById('upload-reference');

    let currentConfig = {
        shape: 'round',
        flavor: 'vanilla',
        tiers: 2
    };

    // Shape Images Config (simulating dynamic switch)
    const cakeAssets = {
        round: 'assets/vanilla_cake.png',
        square: 'assets/square_cake.png',
        heart: 'assets/heart_cake.png'
    };

    // Shape Selection
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            shapeBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            const shape = btn.dataset.shape;
            currentConfig.shape = shape;

            // Animate and Switch Image
            gsap.to(previewCake, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    // Update source based on shape choice
                    if (cakeAssets[shape]) {
                        previewCake.src = cakeAssets[shape];
                    }

                    gsap.to(previewCake, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        });
    });

    // Tier Selection
    tierRange.addEventListener('input', (e) => {
        const val = e.target.value;
        currentConfig.tiers = parseInt(val);
        tierDisplay.innerText = `${val} Tier${val > 1 ? 's' : ''}`;

        // Simulating tier height growth using scale
        const scale = 0.8 + (val * 0.1);
        gsap.to(previewCake, { scale: scale, duration: 0.3 });
    });

    // Flavor Selection
    flavorSelect.addEventListener('change', (e) => {
        currentConfig.flavor = e.target.value;
        // Optional: Could change cake color/tint filter here
    });

    // --- MODAL LOGIC & DATA TRANSFER ---
    const triggerModalBtn = document.getElementById('trigger-modal-btn');
    const modal = document.getElementById('order-modal');
    const modalClose = document.querySelector('.modal-close');
    let orderForm = null;
    if (modal) orderForm = modal.querySelector('form');

    // Hidden inputs in the modal form
    const modalShape = document.getElementById('modal-shape');
    const modalFlavor = document.getElementById('modal-flavor');
    const modalTiers = document.getElementById('modal-tiers');

    // Handle Form Submission with Custom Redirects
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = orderForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Processing...";
            btn.disabled = true;

            const formData = new FormData(this);
            const paymentMethod = formData.get('payment'); // 'cash' or 'online'

            // Send to FormSubmit via AJAX
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (paymentMethod === 'online') {
                        window.location.href = 'payment.html';
                    } else {
                        window.location.href = 'success.html';
                    }
                })
                .catch(error => {
                    alert('Something went wrong. Please try again.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }



    // Reset logic when opening modal via normal "Atelier" button
    if (triggerModalBtn) {
        triggerModalBtn.addEventListener('click', () => {
            // Reset the "Ordering: [Design Name]" label because this is a custom order
            const designLabel = document.getElementById('modal-design-label');
            const modalDesign = document.getElementById('modal-ordered-design');

            if (designLabel) designLabel.classList.remove('visible');
            if (modalDesign) modalDesign.value = "Custom Design (from Atelier)"; // Generic name

            // Transfer current config to hidden form inputs
            if (modalShape) modalShape.value = currentConfig.shape;
            if (modalFlavor) modalFlavor.value = currentConfig.flavor;
            if (modalTiers) modalTiers.value = currentConfig.tiers;

            // Show Modal
            if (modal) {
                modal.classList.add('active');
                gsap.fromTo('.modal-content', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
            }
        });
    }

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

    // Direct Order Logic (Bypassing Atelier)
    if (detailOrderBtn) {
        detailOrderBtn.addEventListener('click', function () {
            // Close detail modal
            if (detailModal) detailModal.classList.remove('active');

            // Pre-fill Order Modal
            const flavor = this.dataset.flavor || 'vanilla';
            const modalFlavor = document.getElementById('modal-flavor');
            if (modalFlavor) modalFlavor.value = flavor;

            // Open Order Modal directly
            const orderModal = document.getElementById('order-modal');
            if (orderModal) {
                orderModal.classList.add('active');
                gsap.fromTo(orderModal.querySelector('.modal-content'),
                    { y: -50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4 }
                );
            }
        });
    }

});

