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
    const priceTag = document.getElementById('price-tag');
    const flavorSelect = document.getElementById('flavor-select');
    const previewCake = document.getElementById('preview-cake');

    let currentConfig = {
        shape: 'round',
        flavor: 'vanilla',
        tiers: 2
    };

    const basePrices = {
        round: 100,
        square: 150,
        tower: 300
    };

    const tierMultiplier = 75; // Per tier cost
    const flavorPremium = {
        vanilla: 0,
        chocolate: 20,
        lemon: 30,
        hazelnut: 50
    };

    function updatePrice() {
        const base = basePrices[currentConfig.shape];
        const tierCost = currentConfig.tiers * tierMultiplier;
        const flavorCost = flavorPremium[currentConfig.flavor];

        const total = base + tierCost + flavorCost;

        // Animate price change
        priceTag.innerText = `$${total.toFixed(2)}`;

        // Simple scale animation on update
        gsap.fromTo(priceTag, { scale: 1.2, color: '#fff' }, { scale: 1, color: '#c5a059', duration: 0.3 });
    }

    // Shape Selection
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            shapeBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            currentConfig.shape = btn.dataset.shape;

            // Update preview image (simulation)
            // ideally we would swap images, but here we might just animate/filter for effect since we have limited assets
            gsap.to(previewCake, {
                scale: 0.9,
                opacity: 0.5,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onRepeat: () => {
                    // Slight rotation or effect to simulate change
                    if (currentConfig.shape === 'square') {
                        previewCake.style.borderRadius = '0px';
                    } else {
                        previewCake.style.borderRadius = '10px';
                    }
                }
            });

            updatePrice();
        });
    });

    // Tier Selection
    tierRange.addEventListener('input', (e) => {
        const val = e.target.value;
        currentConfig.tiers = parseInt(val);
        tierDisplay.innerText = `${val} Tier${val > 1 ? 's' : ''}`;

        // Simulating tier height growth
        const scale = 0.8 + (val * 0.1); // 0.9 to 1.3
        gsap.to(previewCake, { scale: scale, duration: 0.3 });

        updatePrice();
    });

    // Flavor Selection
    flavorSelect.addEventListener('change', (e) => {
        currentConfig.flavor = e.target.value;
        updatePrice();
    });

    // Initial calculation
    updatePrice();

});

