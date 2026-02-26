/**
 * Central Product Database for Bakenovation
 * Used by shop.html, trending.html, gifting.html, and product.html
 */

const productData = {
    // --- Shop / Featured ---
    'raspberry-vintage': {
        title: 'Raspberry Vintage Cake',
        desc: 'Topped with imported raspberries, and ribbons, this cake is a must for 2025-2026 celebrations. Perfect for those Pinteresty birthdays, and anniversaries, for the perfect vintage aesthetic era.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg', '2.0 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours of delivery.'
    },
    '24k-teddy': {
        title: '24K Teddy',
        desc: 'A cake decorated with 24K gold, large edible pearls, handcrafted fondant teddy & deer and roses along with gold dusted chocolate balls.',
        price: 4500,
        imgs: ['https://fleurons.in/cdn/shop/files/E8B3C2BE-3D7A-440F-BE05-4FC8C9A0E795.jpg?v=1762252210'],
        weights: ['1.0 kg', '1.5 kg', '2.5 kg'],
        care: 'Edible gold is delicate. Keep away from direct sunlight.'
    },
    'classic-lv': {
        title: 'Classic LV',
        desc: 'Non-Fondant cake, topped with golden buds, and handcrafted sugar peonies and leaves. Stencilling in Louis Vuitton pattern.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/8E7557F2-A85F-4E08-B0DA-92270D97D118.jpg?v=1748428764'],
        weights: ['1.0 kg', '1.5 kg', '2.0 kg'],
        care: 'Handle with care to preserve the stencilled design.'
    },
    'golden-couple': {
        title: 'Golden Couple Anniversary Cake',
        desc: 'Featuring golden buds and handcrafted sugar flowers, this cake is a sophisticated choice for celebrating love.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/IMG_0617.jpg?v=1748428750'],
        weights: ['1.0 kg', '1.5 kg', '2.0 kg'],
        care: 'Keep refrigerated until serving.'
    },
    'hello-gorgeous': {
        title: 'Hello Gorgeous',
        desc: 'Layered with shades of purple cream, adorned with edible pearls, chocolate spheres and edible wafer paper flowers.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/7249C4DE-0C86-4C86-A1B9-6AC077E292FC.jpg?v=1748428843'],
        weights: ['1.0 kg', '1.5 kg'],
        care: 'Wafer paper is sensitive to humidity.'
    },
    'abby': {
        title: 'Abby',
        desc: 'Tall cake created in a shade of light grey, decorated with edible gold leaf, imported sprinkles, and chocolate balls.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/11A50BD4-518C-4B86-9D83-DE2525BB38E1.jpg?v=1748428924'],
        weights: ['1.0 kg', '1.5 kg', '2.0 kg'],
        care: 'A tall cake requires careful transport.'
    },
    'pink-bows': {
        title: 'Vintage All Pink & Bows Cake',
        desc: 'Feminine, elegant and everything pink! Adorned with delicate bows for a truly vintage aesthetic.',
        price: 1500,
        imgs: ['https://fleurons.in/cdn/shop/files/VintageAllPink_BowsCake_1.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg'],
        care: 'Bows are made of icing, handle gently.'
    },

    // --- Bento Cakes / Trending ---
    'minimalist-heart': {
        title: 'Minimalist Heart Bento',
        desc: 'The perfect mini cake for a sweet gesture. Simple, elegant heart design with smooth frosting.',
        price: 750,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-heart-bento.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Keep in the bento box until serving.'
    },
    'stars-sprinkles': {
        title: 'Stars and Sprinkles Bento Cake',
        desc: 'A festive and fun mini cake covered in whimsical stars and colorful sprinkles.',
        price: 750,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Store in a cool place.'
    },
    'pearls-bento': {
        title: 'Pearls Bento Cake',
        desc: 'Chic and sophisticated, decorated with delicate edible pearls for a touch of class.',
        price: 850,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Pearls are edible but hard, chew carefully.'
    },
    'ombre-bento': {
        title: 'Ombre Bento Cake',
        desc: 'A beautiful gradient of colors, making it the perfect "Thinking of You" mini gift.',
        price: 800,
        imgs: ['https://fleurons.in/cdn/shop/products/ombre-cake.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Maintain at room temperature for 15 mins before serving.'
    },
    'birthday-candles': {
        title: 'Birthday Candles Bento Cake',
        desc: 'Classic birthday celebration in a box, complete with miniature candles and festive decor.',
        price: 900,
        imgs: ['https://fleurons.in/cdn/shop/products/birthday-candles-bento.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Remove candles before slicing.'
    },
    'te-amo': {
        title: 'Te Amo Bento Cake',
        desc: 'Express your love with this romantic mini cake, perfectly sized for a couple.',
        price: 950,
        imgs: ['https://fleurons.in/cdn/shop/products/te-amo-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Perfect for sharing!'
    },
    'minimalist-bento': {
        title: 'Minimalist Bento Cake',
        desc: 'Simple and clean design, focusing on high-quality frosting and light sponge.',
        price: 700,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg'],
        care: 'Store in airtight container.'
    }
};

// Export for module support if needed, but for now we'll use it as a global script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = productData;
}
