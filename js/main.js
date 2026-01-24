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

    // --- MODAL LOGIC & DATA TRANSFER ---
    const modal = document.getElementById('order-modal');
    const modalClose = document.querySelector('.modal-close');
    let orderForm = null;
    if (modal) orderForm = modal.querySelector('form');

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

    // --- AI DESIGN STUDIO LOGIC ---
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const aiPrompt = document.getElementById('ai-prompt');
    const aiResultContainer = document.getElementById('ai-result-container');
    const aiLoading = document.getElementById('ai-loading');
    const aiGeneratedImage = document.getElementById('ai-generated-image');
    const aiOrderBtn = document.getElementById('ai-order-btn');
    const aiRetryBtn = document.getElementById('ai-retry-btn');

    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', () => {
            const prompt = aiPrompt.value.trim();
            if (!prompt) {
                alert("Please describe your dream cake first!");
                return;
            }

            // UI Loading State
            const btnText = aiGenerateBtn.querySelector('.btn-text');
            const spinner = aiGenerateBtn.querySelector('.spinner');
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            aiGenerateBtn.disabled = true;

            // Show Result container (simulating start)
            aiResultContainer.style.display = 'block';
            aiLoading.style.display = 'flex';

            // Scroll to result
            aiResultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // SIMULATE AI GENERATION (Mock Logic with "God of AI" Intelligence)
            setTimeout(() => {
                // Advanced Keyword Matching Layer (God of AI Logic)
                let selectedImage = 'assets/wedding_cake.png'; // Fallback / Base Luxury
                const p = prompt.toLowerCase();

                if (p.includes('birthday') || p.includes('colorful') || p.includes('sprinkles') || p.includes('playful')) {
                    selectedImage = 'assets/red_velvet.png';
                } else if (p.includes('wedding') || p.includes('white') || p.includes('floral') || p.includes('tier')) {
                    selectedImage = 'assets/wedding_cake.png';
                } else if (p.includes('chocolate') || p.includes('dark') || p.includes('gold leaf') || p.includes('ganache')) {
                    selectedImage = 'assets/chocolate_cake.png';
                } else if (p.includes('modern') || p.includes('blue') || p.includes('geometric') || p.includes('sapphire')) {
                    selectedImage = 'assets/hero-cake.png';
                } else if (p.includes('vanilla') || p.includes('simple') || p.includes('bean')) {
                    selectedImage = 'assets/vanilla_cake.png';
                }

                console.log(`AI Processing complete. Style identified. Serving: ${selectedImage}`);
                aiGeneratedImage.src = selectedImage;
                aiLoading.style.display = 'none';

                btnText.style.display = 'inline';
                spinner.style.display = 'none';
                aiGenerateBtn.disabled = false;

            }, 3000); // Increased "thinking" time
        });
    }

    if (aiOrderBtn) {
        aiOrderBtn.addEventListener('click', () => {
            // Construct prompt again for validity
            const userDetails = aiPromptInput.value.trim();
            const smartPrompt = `${snapState.type} cake, ${snapState.style} style, ${snapState.color} color palette, ${snapState.shape} shape, ${snapState.tiers} tier(s). ${userDetails}`;

            // Open Modal
            if (orderModal) {
                orderModal.classList.add('active');

                // Pre-fill details
                const designInput = document.getElementById('modal-ordered-design');
                const messageInput = orderModal.querySelector('textarea[name="message"]');

                if (designInput) designInput.value = `Sweet Snap AI Design`;
                if (messageInput) {
                    messageInput.value = `[AI CONFIGURATION]\n${smartPrompt}\n(Please refer to generated concept)`;
                }

                gsap.fromTo(orderModal.querySelector('.modal-content'),
                    { y: -50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4 }
                );
            }
        });
    }

});
