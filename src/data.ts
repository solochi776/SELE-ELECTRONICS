import { Product, Testimonial, PromoFlyer } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    category: 'iphones',
    priceZMW: 29500,
    priceUSD: 1150,
    originalPriceZMW: 32000,
    originalPriceUSD: 1250,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    description: 'The ultimate iPhone. Featuring a strong and light titanium design, custom Action button, and the most powerful iPhone camera ever.',
    specs: ['Super Retina XDR Display 6.7"', 'A17 Pro Chip', '48MP Main Camera + 5x Telephoto', 'Premium Titanium Frame', '256GB Supercharged Storage'],
    isHotDeal: true,
    promoBadge: 'Best Seller',
    stockStatus: 'in-stock'
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    category: 'iphones',
    priceZMW: 21000,
    priceUSD: 820,
    image: 'https://images.unsplash.com/photo-1695048133103-ccd606ea9ec8?auto=format&fit=crop&w=600&q=80',
    description: 'Features Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.',
    specs: ['6.1" OLED Display', 'A16 Bionic Chip', '48MP Dual Camera System', 'Dynamic Island Notifications', '128GB Storage'],
    stockStatus: 'in-stock'
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    category: 'iphones',
    priceZMW: 17500,
    priceUSD: 680,
    originalPriceZMW: 19500,
    originalPriceUSD: 760,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1ebe4cd1?auto=format&fit=crop&w=600&q=80',
    description: 'Pro-level performance. Introducing Dynamic Island, an interactive way to receive calls or music, and an always-on display.',
    specs: ['6.1" Always-On Screen', 'A16 Bionic Chip', '48MP Pro Triple Camera', 'Premium Stainless Steel', '128GB Storage'],
    isHotDeal: true,
    promoBadge: 'Save K2,000',
    stockStatus: 'low-stock'
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'samsung',
    priceZMW: 33000,
    priceUSD: 1280,
    originalPriceZMW: 35000,
    originalPriceUSD: 1360,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility.',
    specs: ['6.8" Flat QHD+ 120Hz', 'Snapdragon 8 Gen 3', '200MP Quad Camera System', 'Built-in S Pen Stylus', 'Titanium Frame + Galaxy AI'],
    isHotDeal: true,
    promoBadge: 'New Arrival',
    stockStatus: 'in-stock'
  },
  {
    id: 'samsung-s23-ultra',
    name: 'Samsung Galaxy S23 Ultra',
    category: 'samsung',
    priceZMW: 22000,
    priceUSD: 850,
    image: 'https://images.unsplash.com/photo-1678912990809-511ce35fdca5?auto=format&fit=crop&w=600&q=80',
    description: 'Designed with the planet in mind, and equipped with a built-in S Pen, Nightography camera, and supreme gaming performance.',
    specs: ['6.8" Edge QHD+ Display', 'Snapdragon 8 Gen 2', '200MP Main Wide Camera', 'Dual Telephoto Zoom (10x + 3x)', '256GB Storage + S-Pen Included'],
    stockStatus: 'in-stock'
  },
  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    category: 'pixels',
    priceZMW: 16500,
    priceUSD: 640,
    originalPriceZMW: 18500,
    originalPriceUSD: 720,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    description: 'The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and a stunning design.',
    specs: ['6.7" Super Actua Display', 'Google Tensor G3 Chip', '50MP Triple Camera System', 'Magic Eraser & AI Photo Unblur', '128GB Storage, Fast Charging'],
    stockStatus: 'in-stock'
  },
  {
    id: 'google-pixel-7a',
    name: 'Google Pixel 7a',
    category: 'pixels',
    priceZMW: 11500,
    priceUSD: 440,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    description: 'Engineered by Google, with the Tensor G2 chip, the Pixel 7a offers incredible camera features, safety features, and battery life.',
    specs: ['6.1" OLED 90Hz Display', 'Google Tensor G2', '64MP Main Dual Camera', 'IP67 Dust & Water Resistant', '128GB Storage'],
    stockStatus: 'low-stock'
  },
  {
    id: 'kizone-learn-tab',
    name: 'Sele LearnTab Pro (Kids Edition)',
    category: 'tablets',
    priceZMW: 2200,
    priceUSD: 85,
    originalPriceZMW: 2800,
    originalPriceUSD: 108,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    description: 'Our top-ranked educational tablet for kids. Loaded with premium learning content, safe kid-friendly browser, and ultra-durable rugged bumper case.',
    specs: ['10.1" Eye-Care HD Display', 'Premium Rugged Anti-Drop Case', 'Pre-installed Learning Apps', 'Parental Control Dashboard', 'Long-lasting 6000mAh Battery'],
    isHotDeal: true,
    promoBadge: 'Kid\'s Choice',
    stockStatus: 'in-stock'
  },
  {
    id: 'kizone-play-tab',
    name: 'KidZone PlayTab Starter',
    category: 'tablets',
    priceZMW: 1600,
    priceUSD: 62,
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight learning tablet for toddlers and young kids. Comes with a bright colorful stand case that is highly interactive.',
    specs: ['8" HD IPS Display', 'Colorful Dynamic Kickstand Case', 'Preloaded Games & Painting Tool', 'Safe Browsing Network Guard', '32GB Storage + MicroSD Slot'],
    stockStatus: 'in-stock'
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 13" M3',
    category: 'laptops',
    priceZMW: 29900,
    priceUSD: 1150,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'Strikingly thin. Lightning fast. MacBook Air with the M3 chip sails through work and play effortlessly, with unmatched portability.',
    specs: ['Liquid Retina Display 13.6"', 'Apple M3 8-Core CPU', '8GB Unified RAM + 256GB SSD', 'Up to 18 Hours Battery Life', 'Silent Fanless Cooling System'],
    stockStatus: 'in-stock'
  },
  {
    id: 'hp-elitebook-840',
    name: 'HP EliteBook 840 G9',
    category: 'laptops',
    priceZMW: 14900,
    priceUSD: 580,
    originalPriceZMW: 16900,
    originalPriceUSD: 660,
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&w=600&q=80',
    description: 'Designed for enterprise performance. This premium business laptop offers high speeds, advanced remote collaboration tools, and hardened specs.',
    specs: ['14" Full HD+ IPS Screen', 'Intel Core i7-1260P', '16GB DDR5 RAM + 512GB SSD', 'HP Wolf Security Suite', 'Premium Bang & Olufsen Audio'],
    isHotDeal: true,
    promoBadge: 'Business Deal',
    stockStatus: 'in-stock'
  },
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen)',
    category: 'accessories',
    priceZMW: 5200,
    priceUSD: 200,
    image: 'https://images.unsplash.com/photo-1588449668338-d13417f16fd6?auto=format&fit=crop&w=600&q=80',
    description: 'Rebuilt from the sound up. Features up to two times more Active Noise Cancellation, Adaptive Audio, and personalized spatial audio.',
    specs: ['Custom Apple H2 Chip', 'Up to 2x Noise Cancelling', 'Adaptive Transparency Mode', 'Sweat & Water Resistant (IPX4)', 'Up to 6 hours audio listen time'],
    stockStatus: 'in-stock'
  },
  {
    id: 'smartwatch-ultra',
    name: 'Premium Rugged SmartWatch Ultra',
    category: 'accessories',
    priceZMW: 1600,
    priceUSD: 62,
    originalPriceZMW: 2100,
    originalPriceUSD: 81,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    description: 'A rugged adventure wristwatch featuring a reinforced metal alloy frame, heart rate tracker, blood oxygen sensor, and built-in GPS maps integrations.',
    specs: ['1.96" HD Sapphire Screen', 'Zinc Alloy Shockproof Cover', '24H Pulse / Sleep / Blood Alert', 'Multi-sport Professional Modes', 'Extra-long 15-day Battery Standby'],
    isHotDeal: true,
    promoBadge: 'Aventure Ready',
    stockStatus: 'in-stock'
  },
  {
    id: 'portable-powerbank',
    name: 'Sele SuperCharge PowerBank 20k',
    category: 'accessories',
    priceZMW: 750,
    priceUSD: 29,
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17b?auto=format&fit=crop&w=600&q=80',
    description: 'A 22.5W high-density battery charger with multiple integrated cables. Fast charges your Pixels and iPhones up to 4 times.',
    specs: ['20,000mAh Extreme Capacity', '22.5W Fast Power Delivery', 'Built-in USB-C & Lightning Cables', 'Intelligent LED Battery Indicator', 'Approved for Airline Flights'],
    stockStatus: 'in-stock'
  }
];

export const PROMO_FLYERS: PromoFlyer[] = [
  {
    id: 'flyer-1',
    title: 'Slayer Back-to-School Combo',
    subtitle: 'Get a Sele LearnTab Kids Tablet + 10000mAh Powerbank with 20% savings!',
    discountBadge: 'Save 20%',
    dealEnds: 'Limited Stock',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    category: 'Tablets'
  },
  {
    id: 'flyer-2',
    title: 'Samsung S24 Ultra Elite Promo',
    subtitle: 'Get Galaxy Buds FE + Protection Case completely FREE with S24 Ultra purchases this week!',
    discountBadge: 'FREE VIP Bundle',
    dealEnds: 'Only 4 units left',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    category: 'Samsung'
  },
  {
    id: 'flyer-3',
    title: 'iPhones Clearance Weekend',
    subtitle: 'Exclusive price slash on pristine open-box iPhone 14 Pro & 15 models.',
    discountBadge: 'Up to K3,000 Off',
    dealEnds: 'Ends Sunday',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
    category: 'iPhones'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Michael Mwansa',
    role: 'Software Developer',
    comment: 'I ordered the MacBook Air M3 and received it in Lusaka within two hours. It is 100% genuine and pristine. Manfred was incredibly responsive over WhatsApp and guided me through setup!',
    rating: 5,
    date: '1 week ago',
    location: 'Lusaka, Zambia'
  },
  {
    id: 't-2',
    name: 'Bwalya Chileshe',
    role: 'Parent & Educator',
    comment: 'The Sele LearnTab Kids Pro has been amazing for my kids. The pre-installed apps are educational, and the protective case is virtually armor-plated. Fast delivery and stellar WhatsApp customer service.',
    rating: 5,
    date: '2 weeks ago',
    location: 'Ndola, Zambia'
  },
  {
    id: 't-3',
    name: 'Namwinga Kabwe',
    role: 'Business Consultant',
    comment: 'Got my Samsung Galaxy S23 Ultra from Sele. Seamless order, best pricing, and highly authentic specs verified instantly. Manfred is my go-to tech dealer in Zambia now.',
    rating: 5,
    date: '3 days ago',
    location: 'Kitwe, Zambia'
  }
];

export const WHATSAPP_NUMBER = '+260978969098';
export const WHATSAPP_OWNER_NAME = 'Manfred';
export const SELE_REPRESENTATIVE = 'Manfred';
export const PHYSICAL_SHOP_ADDRESS = 'Sele Electronics, Freedom Way Plaza, Room 14, Lusaka, Zambia';
export const EMAIL_ADDRESS = 'contact@sele-electronics.com';
export const PHONE_NUMBER = '+260978969098';
