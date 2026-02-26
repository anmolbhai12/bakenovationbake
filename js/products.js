const productData = {
    'cookies-special': {
        title: 'Cookies Special',
        category: 'cookies',
        desc: 'Cookies Special - A premium creation from Bakenovation.',
        price: 550,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'classic-cookies-box': {
        title: 'Classic Cookies Box',
        category: 'cookies',
        desc: 'Classic Cookies Box - A premium creation from Bakenovation.',
        price: 650,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'mini-cookie-gift-box': {
        title: 'Mini Cookie Gift Box',
        category: 'cookies',
        desc: 'Mini Cookie Gift Box - A premium creation from Bakenovation.',
        price: 480,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-heart-bento.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'anniversary-cake': {
        title: 'Anniversary Cake',
        category: 'cakes',
        desc: 'Anniversary Cake - A premium creation from Bakenovation.',
        price: 800,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'golden-couple': {
        title: 'Golden Couple',
        category: 'cakes',
        desc: 'Golden Couple - A premium creation from Bakenovation.',
        price: 2400,
        imgs: ['https://fleurons.in/cdn/shop/files/IMG_0617_165x.jpg?v=1748428750'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'raspberry-vintage': {
        title: 'Raspberry Vintage',
        category: 'cakes',
        desc: 'Raspberry Vintage - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'classic-lv': {
        title: 'Classic LV',
        category: 'cakes',
        desc: 'Classic LV - A premium creation from Bakenovation.',
        price: 950,
        imgs: ['https://fleurons.in/cdn/shop/files/8E7557F2-A85F-4E08-B0DA-92270D97D118_165x.jpg?v=1748428764'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'hello-gorgeous': {
        title: 'Hello Gorgeous',
        category: 'cakes',
        desc: 'Hello Gorgeous - A premium creation from Bakenovation.',
        price: 1100,
        imgs: ['https://fleurons.in/cdn/shop/files/7249C4DE-0C86-4C86-A1B9-6AC077E292FC.jpg?v=1748428843'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'classic-bento': {
        title: 'Classic Bento',
        category: 'cakes',
        desc: 'Classic Bento - A premium creation from Bakenovation.',
        price: 800,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'kids-special': {
        title: 'Kids Special',
        category: 'cakes',
        desc: 'Kids Special - A premium creation from Bakenovation.',
        price: 700,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-heart-bento.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'kids-star-cake': {
        title: 'Kids Star Cake',
        category: 'cakes',
        desc: 'Kids Star Cake - A premium creation from Bakenovation.',
        price: 550,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'birthday-candles-bento': {
        title: 'Birthday Candles Bento',
        category: 'cakes',
        desc: 'Birthday Candles Bento - A premium creation from Bakenovation.',
        price: 620,
        imgs: ['https://fleurons.in/cdn/shop/products/birthday-candles-bento.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'aesthetic-beauty': {
        title: 'Aesthetic Beauty',
        category: 'cakes',
        desc: 'Aesthetic Beauty - A premium creation from Bakenovation.',
        price: 850,
        imgs: ['https://fleurons.in/cdn/shop/products/ombre-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'vintage-pink-amp-bows': {
        title: 'Vintage Pink &amp; Bows',
        category: 'cakes',
        desc: 'Vintage Pink &amp; Bows - A premium creation from Bakenovation.',
        price: 950,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'floral-dream': {
        title: 'Floral Dream',
        category: 'cakes',
        desc: 'Floral Dream - A premium creation from Bakenovation.',
        price: 1200,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'golden-floral-cake': {
        title: 'Golden Floral Cake',
        category: 'cakes',
        desc: 'Golden Floral Cake - A premium creation from Bakenovation.',
        price: 2400,
        imgs: ['https://fleurons.in/cdn/shop/files/IMG_0617_165x.jpg?v=1748428750'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'raspberry-floral': {
        title: 'Raspberry Floral',
        category: 'cakes',
        desc: 'Raspberry Floral - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'geode-magic': {
        title: 'Geode Magic',
        category: 'cakes',
        desc: 'Geode Magic - A premium creation from Bakenovation.',
        price: 1500,
        imgs: ['https://fleurons.in/cdn/shop/files/E8B3C2BE-3D7A-440F-BE05-4FC8C9A0E795_165x.jpg?v=1762252210'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'geode-vintage': {
        title: 'Geode Vintage',
        category: 'cakes',
        desc: 'Geode Vintage - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'crystal-geode-cake': {
        title: 'Crystal Geode Cake',
        category: 'cakes',
        desc: 'Crystal Geode Cake - A premium creation from Bakenovation.',
        price: 1200,
        imgs: ['https://fleurons.in/cdn/shop/files/8E7557F2-A85F-4E08-B0DA-92270D97D118_165x.jpg?v=1748428764'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'butterfly-kisses': {
        title: 'Butterfly Kisses',
        category: 'cakes',
        desc: 'Butterfly Kisses - A premium creation from Bakenovation.',
        price: 900,
        imgs: ['https://fleurons.in/cdn/shop/products/birthday-candles-bento.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'butterfly-ombre': {
        title: 'Butterfly Ombre',
        category: 'cakes',
        desc: 'Butterfly Ombre - A premium creation from Bakenovation.',
        price: 780,
        imgs: ['https://fleurons.in/cdn/shop/products/ombre-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'butterfly-mini-bento': {
        title: 'Butterfly Mini Bento',
        category: 'cakes',
        desc: 'Butterfly Mini Bento - A premium creation from Bakenovation.',
        price: 650,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-heart-bento.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'secret-message-bento': {
        title: 'Secret Message Bento',
        category: 'cakes',
        desc: 'Secret Message Bento - A premium creation from Bakenovation.',
        price: 650,
        imgs: ['https://fleurons.in/cdn/shop/products/te-amo-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'hidden-heart-bento': {
        title: 'Hidden Heart Bento',
        category: 'cakes',
        desc: 'Hidden Heart Bento - A premium creation from Bakenovation.',
        price: 750,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'love-note-bento': {
        title: 'Love Note Bento',
        category: 'cakes',
        desc: 'Love Note Bento - A premium creation from Bakenovation.',
        price: 580,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'stars-amp-sprinkles-bento': {
        title: 'Stars &amp; Sprinkles Bento',
        category: 'cakes',
        desc: 'Stars &amp; Sprinkles Bento - A premium creation from Bakenovation.',
        price: 620,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'ombre-bento': {
        title: 'Ombre Bento',
        category: 'cakes',
        desc: 'Ombre Bento - A premium creation from Bakenovation.',
        price: 580,
        imgs: ['https://fleurons.in/cdn/shop/products/ombre-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'signature-blend': {
        title: 'Signature Blend',
        category: 'cakes',
        desc: 'Signature Blend - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    '24k-gold-signature': {
        title: '24K Gold Signature',
        category: 'cakes',
        desc: '24K Gold Signature - A premium creation from Bakenovation.',
        price: 2400,
        imgs: ['https://fleurons.in/cdn/shop/files/E8B3C2BE-3D7A-440F-BE05-4FC8C9A0E795_165x.jpg?v=1762252210'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'signature-elegance': {
        title: 'Signature Elegance',
        category: 'cakes',
        desc: 'Signature Elegance - A premium creation from Bakenovation.',
        price: 1500,
        imgs: ['https://fleurons.in/cdn/shop/files/7249C4DE-0C86-4C86-A1B9-6AC077E292FC.jpg?v=1748428843'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'fresh-fruit-delight': {
        title: 'Fresh Fruit Delight',
        category: 'cakes',
        desc: 'Fresh Fruit Delight - A premium creation from Bakenovation.',
        price: 1400,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'tropical-fruit-cake': {
        title: 'Tropical Fruit Cake',
        category: 'cakes',
        desc: 'Tropical Fruit Cake - A premium creation from Bakenovation.',
        price: 1100,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'berry-bliss-cake': {
        title: 'Berry Bliss Cake',
        category: 'cakes',
        desc: 'Berry Bliss Cake - A premium creation from Bakenovation.',
        price: 950,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'rich-cheesecake': {
        title: 'Rich Cheesecake',
        category: 'cakes',
        desc: 'Rich Cheesecake - A premium creation from Bakenovation.',
        price: 1100,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'ny-style-cheesecake': {
        title: 'NY Style Cheesecake',
        category: 'cakes',
        desc: 'NY Style Cheesecake - A premium creation from Bakenovation.',
        price: 980,
        imgs: ['https://fleurons.in/cdn/shop/products/pearls-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'raspberry-cheesecake': {
        title: 'Raspberry Cheesecake',
        category: 'cakes',
        desc: 'Raspberry Cheesecake - A premium creation from Bakenovation.',
        price: 1250,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'afternoon-tea-cake': {
        title: 'Afternoon Tea Cake',
        category: 'cakes',
        desc: 'Afternoon Tea Cake - A premium creation from Bakenovation.',
        price: 750,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'earl-grey-tea-cake': {
        title: 'Earl Grey Tea Cake',
        category: 'cakes',
        desc: 'Earl Grey Tea Cake - A premium creation from Bakenovation.',
        price: 680,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'matcha-tea-cake': {
        title: 'Matcha Tea Cake',
        category: 'cakes',
        desc: 'Matcha Tea Cake - A premium creation from Bakenovation.',
        price: 820,
        imgs: ['https://fleurons.in/cdn/shop/products/ombre-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'christmas-special': {
        title: 'Christmas Special',
        category: 'cakes',
        desc: 'Christmas Special - A premium creation from Bakenovation.',
        price: 1300,
        imgs: ['https://fleurons.in/cdn/shop/products/minimalist-bento-cake.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'xmas-stars-bento': {
        title: 'Xmas Stars Bento',
        category: 'cakes',
        desc: 'Xmas Stars Bento - A premium creation from Bakenovation.',
        price: 1100,
        imgs: ['https://fleurons.in/cdn/shop/products/stars-and-sprinkles.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'festive-delight-cake': {
        title: 'Festive Delight Cake',
        category: 'cakes',
        desc: 'Festive Delight Cake - A premium creation from Bakenovation.',
        price: 1500,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'raspberry-vintage-cake': {
        title: 'Raspberry Vintage Cake',
        category: 'cakes',
        desc: 'Raspberry Vintage Cake - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    '24k-teddy': {
        title: '24K Teddy',
        category: 'cakes',
        desc: '24K Teddy - A premium creation from Bakenovation.',
        price: 4500,
        imgs: ['https://fleurons.in/cdn/shop/files/E8B3C2BE-3D7A-440F-BE05-4FC8C9A0E795_165x.jpg?v=1762252210'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'golden-couple-anniversary-cake': {
        title: 'Golden Couple Anniversary Cake',
        category: 'cakes',
        desc: 'Golden Couple Anniversary Cake - A premium creation from Bakenovation.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/IMG_0617_165x.jpg?v=1748428750'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'abby': {
        title: 'Abby',
        category: 'cakes',
        desc: 'Abby - A premium creation from Bakenovation.',
        price: 1800,
        imgs: ['https://fleurons.in/cdn/shop/files/11A50BD4-518C-4B86-9D83-DE2525BB38E1_165x.jpg?v=1748428924'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'vintage-all-pink-bows-cake': {
        title: 'Vintage All Pink & Bows Cake',
        category: 'cakes',
        desc: 'Vintage All Pink & Bows Cake - A premium creation from Bakenovation.',
        price: 1500,
        imgs: ['https://fleurons.in/cdn/shop/files/VintageAllPink_BowsCake_1.jpg?v=1711617436'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'minimalist-heart-bento': {
        title: 'Minimalist Heart Bento',
        category: 'cakes',
        desc: 'Minimalist Heart Bento - A premium creation from Bakenovation.',
        price: 750,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'stars-and-sprinkles-bento-cake': {
        title: 'Stars and Sprinkles Bento Cake',
        category: 'cakes',
        desc: 'Stars and Sprinkles Bento Cake - A premium creation from Bakenovation.',
        price: 850,
        imgs: ['https://fleurons.in/cdn/shop/files/E8B3C2BE-3D7A-440F-BE05-4FC8C9A0E795_165x.jpg?v=1762252210'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'pearls-bento-cake': {
        title: 'Pearls Bento Cake',
        category: 'cakes',
        desc: 'Pearls Bento Cake - A premium creation from Bakenovation.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/8E7557F2-A85F-4E08-B0DA-92270D97D118_165x.jpg?v=1748428764'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'ombre-bento-cake': {
        title: 'Ombre Bento Cake',
        category: 'cakes',
        desc: 'Ombre Bento Cake - A premium creation from Bakenovation.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/IMG_0617_165x.jpg?v=1748428750'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'birthday-candles-bento-cake': {
        title: 'Birthday Candles Bento Cake',
        category: 'cakes',
        desc: 'Birthday Candles Bento Cake - A premium creation from Bakenovation.',
        price: 2200,
        imgs: ['https://fleurons.in/cdn/shop/files/7249C4DE-0C86-4C86-A1B9-6AC077E292FC_165x.jpg?v=1748428843'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
    'belgian-chocolate-gift-box': {
        title: 'Belgian Chocolate Gift Box',
        category: 'gifting',
        desc: 'Belgian Chocolate Gift Box - A premium creation from Bakenovation.',
        price: 2100,
        imgs: ['https://fleurons.in/cdn/shop/files/8BD589CA-D5A9-47A7-AEB9-7593FB0DA972_165x.jpg?v=1763106149'],
        weights: ['0.5 kg', '1.0 kg', '1.5 kg'],
        care: 'Store in refrigerator. Best consumed within 24 hours.'
    },
};

if (typeof module !== 'undefined' && module.exports) { module.exports = productData; }