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

    // Order Button - Email Logic
    orderBtn.addEventListener('click', () => {
        const subject = `New Cake Order Request - ${new Date().toLocaleDateString()}`;

        // Check if file was uploaded (we can't attach it directly to mailto but we can mention it)
        const hasFile = fileInput.files.length > 0 ? "Yes (Please attach in follow-up email)" : "No";
        const fileName = hasFile === "Yes" ? ` (File: ${fileInput.files[0].name})` : "";

        const body = `
Hello Chef Harmeet,

I would like to request a quote for a custom cake.

Shape: ${currentConfig.shape.toUpperCase()}
Flavor: ${currentConfig.flavor.toUpperCase()}
Tiers: ${currentConfig.tiers}
Design Reference Uploaded: ${hasFile} ${fileName}

Please let me know the estimated cost and availability.
        `.trim();

        const mailtoLink = `mailto:anmolji04013.com@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    });

});

