import { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Check,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Search,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Truck,
  Globe,
  HeartHandshake,
  Star,
  Flame,
  Clock,
  MapPin,
  Phone,
  Mail,
  Zap,
  Tag,
  Menu,
  Sparkles,
  Info,
  ExternalLink,
  Percent
} from 'lucide-react';
import { PRODUCTS, PROMO_FLYERS, TESTIMONIALS, WHATSAPP_NUMBER, SELE_REPRESENTATIVE, PHYSICAL_SHOP_ADDRESS, EMAIL_ADDRESS, PHONE_NUMBER } from './data';
import { Product, CartItem, OrderDetails } from './types';

export default function App() {
  // State variables
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'ZMW' | 'USD'>('ZMW');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Quick View / Buy Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  
  // Personal order details form
  const [orderInfo, setOrderInfo] = useState<OrderDetails>({
    customerName: '',
    customerPhone: '',
    customerLocation: '',
    deliveryMethod: 'delivery',
    notes: ''
  });

  // Direct Enquiry Form state
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('General Inquiry');
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Cart order success animation state
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  // Load cart from localStorage on init
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sele_electronics_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('sele_electronics_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  };

  // Quick specifications helper
  const getProductSpecsSuggestions = (product: Product) => {
    const specs: { colors: string[]; storage: string[] } = {
      colors: ['Space Gray', 'Titanium Silver', 'Prism Black'],
      storage: []
    };

    if (product.category === 'iphones') {
      specs.colors = ['Natural Titanium', 'Deep Black', 'White Pearl', 'Navy Blue'];
      specs.storage = ['128GB', '256GB', '512GB'];
    } else if (product.category === 'samsung') {
      specs.colors = ['Titanium Violet', 'Titanium Black', 'Amber Yellow', 'Grey'];
      specs.storage = ['256GB', '512GB', '1TB'];
    } else if (product.category === 'pixels') {
      specs.colors = ['Obsidian', 'Porcelain', 'Bay Blue', 'Hazel'];
      specs.storage = ['128GB', '256GB'];
    } else if (product.category === 'tablets') {
      specs.colors = ['Dino Green Bumper', 'Sky Blue Bumper', 'Princess Pink Bumper'];
      specs.storage = ['32GB', '64GB'];
    } else if (product.category === 'laptops') {
      specs.colors = ['Space Grey', 'Arctic Silver', 'Midnight Gold'];
      specs.storage = ['256GB SSD', '512GB SSD', '1TB SSD'];
    }
    
    return specs;
  };

  // Add item to cart
  const addToCart = (product: Product, specsOverride?: { color?: string; storage?: string }, quantity = 1) => {
    const defaultSpecs = getProductSpecsSuggestions(product);
    const chosenColor = specsOverride?.color || defaultSpecs.colors[0] || '';
    const chosenStorage = specsOverride?.storage || defaultSpecs.storage[0] || '';

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && 
              item.selectedSpecs?.color === chosenColor && 
              item.selectedSpecs?.storage === chosenStorage
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        product,
        quantity,
        selectedSpecs: {
          color: chosenColor,
          storage: chosenStorage
        }
      });
    }

    saveCart(newCart);
    setIsCartOpen(true);
    
    // Reset quick view
    setQuickViewProduct(null);
    setSelectedColor('');
    setSelectedStorage('');
  };

  // Open Quick Add Modal
  const openQuickAdd = (product: Product) => {
    const specs = getProductSpecsSuggestions(product);
    setQuickViewProduct(product);
    setSelectedColor(specs.colors[0] || '');
    setSelectedStorage(specs.storage[0] || '');
  };

  // Update item quantity
  const updateQuantity = (index: number, change: number) => {
    let newCart = [...cart];
    newCart[index].quantity += change;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    saveCart(newCart);
  };

  // Remove from cart
  const removeFromCart = (index: number) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    saveCart(newCart);
  };

  // Clear cart
  const clearCart = () => {
    saveCart([]);
  };

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart total calculations
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = currency === 'ZMW' ? item.product.priceZMW : item.product.priceUSD;
      return total + (price * item.quantity);
    }, 0);
  }, [cart, currency]);

  // Total item count in cart
  const totalItemsCount = useMemo(() => {
    return cart.reduce((prev, item) => prev + item.quantity, 0);
  }, [cart]);

  // Handle Order submit over WhatsApp
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!orderInfo.customerName || !orderInfo.customerPhone || !orderInfo.customerLocation) {
      alert("Please fill in your name, phone number, and delivery location to place your order!");
      return;
    }

    // Build the beautiful WhatsApp message
    const currencySymbol = currency === 'ZMW' ? 'ZK' : '$';
    let itemLines = '';
    
    cart.forEach((item, index) => {
      const price = currency === 'ZMW' ? item.product.priceZMW : item.product.priceUSD;
      const itemTotal = price * item.quantity;
      const specs = item.selectedSpecs 
        ? ` (${item.selectedSpecs.color || ''} | ${item.selectedSpecs.storage || ''})`
        : '';
      itemLines += `*${index + 1}.* ${item.quantity}x ${item.product.name}${specs}\n   ↳ Price: ${currencySymbol} ${itemTotal.toLocaleString()}\n`;
    });

    const isDelivery = orderInfo.deliveryMethod === 'delivery';

    const message = `📦 *NEW ORDER - SELE ELECTRONICS*
---------------------------------------
👤 *Customer Name:* ${orderInfo.customerName}
📞 *Phone/WhatsApp:* ${orderInfo.customerPhone}
📍 *Location:* ${orderInfo.customerLocation}
🚚 *Fulfillment:* ${isDelivery ? '🚀 Fast Home/Office Delivery' : '🏪 Shop Pickup (Lusaka Shop)'}

🛒 *Ordered Items:*
${itemLines}
---------------------------------------
💰 *Grand Total:* ${currencySymbol} ${totalAmount.toLocaleString()}
📝 *Custom Notes/Requests:* ${orderInfo.notes || 'None'}

_Sent via Sele Electronics Digital Kiosk. Please confirm availability to dispatch!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/260978969098?text=${encodedMessage}`;

    // Mark as checked out
    setOrderSubmitted(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setOrderSubmitted(false);
      clearCart();
      setIsCartOpen(false);
    }, 1500);
  };

  // Direct flyer deal checkout trigger
  const handleClaimFlyerDeal = (flyer: typeof PROMO_FLYERS[0]) => {
    const text = `🔥 *SELE SPECIAL DEAL CLAIM*
---------------------------------------
Hello Manfred! I am browsing your site and want to claim the hot promotional flyer deal:

🏷️ *Deal:* ${flyer.title}
🎁 *Details:* ${flyer.subtitle}
⚡ *Badge:* ${flyer.discountBadge}

Please let me know if you have stock available now so I can order!`;
    const whatsappUrl = `https://wa.me/260978969098?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Quick WhatsApp Product Inquiry Trigger
  const handleProductWhatsAppInquiry = (product: Product) => {
    const currencySymbol = currency === 'ZMW' ? 'ZK' : '$';
    const price = currency === 'ZMW' ? product.priceZMW : product.priceUSD;
    const text = `👋 *SELE PRODUCT ENQUIRY*
---------------------------------------
Hello Manfred! I would like to check the availability of:

📱 *Product:* ${product.name}
💰 *Price:* ${currencySymbol} ${price.toLocaleString()}
🔗 *Shop Link:* https://sele-electronics.com/product/${product.id}

Is this ready for pickup or same-day delivery today? Thank you!`;
    const whatsappUrl = `https://wa.me/260978969098?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Direct Enquiry Form Submit over WhatsApp
  const handleEnquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;

    const message = `💬 *SELE SHOP ENQUIRY*
---------------------------------------
👤 *Sender Name:* ${contactName || 'Anonymous Customer'}
📞 *Contact Phone:* ${contactPhone || 'Not specified'}
🏷️ *Reason:* ${contactSubject}

📝 *Message:*
${contactMessage}

_Sent via Sele Electronics Interactive Form._`;

    const whatsappUrl = `https://wa.me/260978969098?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form fields
    setContactMessage('');
    setContactName('');
    setContactPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-200">
      
      {/* Upper Alert Bar */}
      <div className="bg-slate-950 text-slate-300 py-2.5 px-4 text-xs font-mono border-b border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GENUINE STOCK SECURED • LUSAKA SHOP AT FREEDOM WAY PLAZA</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">📞 Direct Call: <span className="text-white font-semibold font-sans">+260 978 969 098</span></span>
            <span className="hidden md:inline">🕒 Mon - Sat: 08:00 - 18:00</span>
          </div>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo / Brand */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/10 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 block font-sans">
                  SELE <span className="text-emerald-600">ELECTRONICS</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block -mt-1 font-semibold">
                  100% genuine guaranteed
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => { setSelectedCategory('all'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Catalog
              </button>
              <button 
                onClick={() => { setSelectedCategory('iphones'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`text-sm font-medium transition-colors ${selectedCategory === 'iphones' ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                iPhones
              </button>
              <button 
                onClick={() => { setSelectedCategory('samsung'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`text-sm font-medium transition-colors ${selectedCategory === 'samsung' ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Samsung
              </button>
              <button 
                onClick={() => { setSelectedCategory('tablets'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`text-sm font-medium transition-colors ${selectedCategory === 'tablets' ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Kids Tablets
              </button>
              <button 
                onClick={() => { document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" /> Hot Deals
              </button>
              <button 
                onClick={() => { document.getElementById('promise-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Our Promise
              </button>
              <button 
                onClick={() => { document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Contact
              </button>
            </nav>

            {/* Config & Action Row */}
            <div className="hidden sm:flex items-center gap-4">
              
              {/* Currency Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
                <button
                  onClick={() => setCurrency('ZMW')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${currency === 'ZMW' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ZMW (K)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  USD ($)
                </button>
              </div>

              {/* Order direct badge */}
              <a
                href={`https://wa.me/260978969098?text=Hello%20Manfred!%20I%20visited%20your%20Sele%20Electronics%20website%20and%20would%20love%20to%20order%20some%20genuine%20electronics.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs lg:text-sm px-4 py-2.5 rounded-full shadow-md shadow-emerald-600/10 transition-colors"
                id="header-order-whatsapp-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                aria-label="Toggle shopping cart"
                id="cart-trigger-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </button>

            </div>

            {/* Mobile Actions Overlay Trigger */}
            <div className="flex items-center lg:hidden gap-3">
              {/* Fast Cart Widget */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-slate-100 text-slate-850 hover:bg-slate-200 transition-colors"
                id="mobile-cart-trigger-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 hover:text-slate-900"
                id="mobile-menu-trigger-btn"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 font-medium">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-500">Shop Currency:</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
                  <button
                    onClick={() => setCurrency('ZMW')}
                    className={`px-3 py-1 text-xs font-bold rounded-full ${currency === 'ZMW' ? 'bg-white text-slate-900 font-sans shadow-xs' : 'text-slate-500'}`}
                  >
                    ZMW (K)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 text-xs font-bold rounded-full ${currency === 'USD' ? 'bg-white text-slate-900 font-sans shadow-xs' : 'text-slate-500'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800 hover:text-emerald-600"
              >
                Full Product Catalog
              </button>
              <button 
                onClick={() => { setSelectedCategory('iphones'); setMobileMenuOpen(false); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800 hover:text-emerald-600 animate-slide"
              >
                iPhones Only
              </button>
              <button 
                onClick={() => { setSelectedCategory('samsung'); setMobileMenuOpen(false); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800 hover:text-emerald-600"
              >
                Samsung Devices
              </button>
              <button 
                onClick={() => { setSelectedCategory('tablets'); setMobileMenuOpen(false); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800 hover:text-emerald-600"
              >
                Kids Educational Tablets
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full text-left py-2 text-amber-600 flex items-center gap-1 font-bold"
              >
                <Flame className="w-4 h-4" /> Hot Flyers & Deals
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); document.getElementById('promise-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800"
              >
                Our Quality Promise
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="block w-full text-left py-2 text-slate-800"
              >
                Get in Touch with Manfred
              </button>

              <div className="pt-2">
                <a
                  href={`https://wa.me/260978969098?text=Hello%20Manfred!%20I%20visited%20your%20Sele%20Electronics%20website%20and%20would%20love%20to%20order%20some%20genuine%20electronics.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Interactive Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,transparent)] opacity-60"></div>
        
        {/* Decorative Grid Line Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400 rotate-12" />
                <span>PREMIUM SMARTPHONES & TABLETS IN ZAMBIA</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">
                Authentic Tech. <br />
                <span className="text-emerald-500 text-glow">Zero Compromises</span>.
              </h1>
              
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Connect with Manfred for 100% genuine guaranteed Apple iPhones, Samsung flagships, Google Pixels, kids educational tablets, protect cases and power gear. Unmatched local service, live verification, and secure 2-hour Lusaka delivery.
              </p>

              {/* Statistics Panel */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-4 w-full border-y border-slate-800 my-2">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">100% Genuine</span>
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-widest leading-none">Box Sealed Devices</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">2-Hour Delivery</span>
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-widest leading-none">Express Line Lusaka</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">+260 978 969...</span>
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-widest leading-none">Instant WhatsApp Rep</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/20 text-center transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Direct Catalog</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="https://wa.me/260978969098?text=Hello%20Manfred!%20I%20want%20to%20know%20your%20latest%20iPhone%20prices%20and%20current%2520hot%2520deals."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-center transition-all flex items-center justify-center gap-2.5"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Inquire with Manfred Directly</span>
                </a>
              </div>
            </div>

            {/* Showcase Image / Interactive Mockup Stack */}
            <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px]">
                {/* Background ambient glowing spheres */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-600/20 blur-3xl -z-10 animate-pulse"></div>
                
                {/* Visual smartphone device presentation frame */}
                <div className="relative bg-slate-950 p-2.5 rounded-[44px] shadow-2xl shadow-emerald-950/40 border border-slate-800 transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-20 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 mr-2"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
                  </div>
                  
                  {/* Smartphone screen mockup */}
                  <div className="relative bg-slate-900 rounded-[34px] overflow-hidden aspect-[9/18.5] border border-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&h=1200&q=80" 
                      alt="iPhone Stock Showcase" 
                      className="w-full h-full object-cover select-none"
                    />
                    
                    {/* Glowing card labels overlays */}
                    <div className="absolute bottom-5 inset-x-4 bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center whitespace-normal">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold block uppercase">HOT DEAL OF THE DAY</span>
                          <span className="text-base font-bold text-white block">iPhone 15 Pro Max</span>
                          <span className="text-slate-300 text-xs">Pristine Unopened Box</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-extrabold text-sm block">K29,500</span>
                          <span className="text-slate-400 line-through text-[11px] block">K32,000</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const product = PRODUCTS.find(p => p.id === 'iphone-15-pro-max');
                          if (product) openQuickAdd(product);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl mt-3 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Order or Customize</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second accessory mini banner */}
                <div className="absolute -bottom-6 -left-8 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce max-w-[200px]">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-mono">KIDS SPECIAL</span>
                    <span className="text-xs font-bold text-white block leading-tight">LearnTab Pro</span>
                    <span className="text-emerald-400 text-xs font-bold font-mono">ZK 2,200</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Highlight Scrolling Ticker Banner */}
      <div className="bg-emerald-600 py-3 overflow-hidden border-y border-emerald-500 z-10 select-none">
        <div className="flex whitespace-nowrap gap-12 text-sm font-bold text-white uppercase font-serif tracking-widest">
          {/* Duplicate loop elements for seamless horizontal movement */}
          <div className="inline-flex gap-12 shrink-0 animate-marquee">
            <span className="flex items-center gap-2">🔥 SELE ELECTRONICS ZAMBIA</span>
            <span className="flex items-center gap-2">📱 Certified Genuine Apple iPhones</span>
            <span className="flex items-center gap-2">👑 Samsung Galaxy Ultra Series In Stock</span>
            <span className="flex items-center gap-2">🎓 Rugged Shock-resistant Kids Tablets</span>
            <span className="flex items-center gap-2">💻 MacBook Air & Pro M3 Upgrades</span>
            <span className="flex items-center gap-2">⚡ 100% Guaranteed Brand Sealed Boxes</span>
            <span className="flex items-center gap-2">🚀 Same Day Express Shipping</span>
          </div>
          <div className="inline-flex gap-12 shrink-0 animate-marquee" aria-hidden="true">
            <span className="flex items-center gap-2">🔥 SELE ELECTRONICS ZAMBIA</span>
            <span className="flex items-center gap-2">📱 Certified Genuine Apple iPhones</span>
            <span className="flex items-center gap-2">👑 Samsung Galaxy Ultra Series In Stock</span>
            <span className="flex items-center gap-2">🎓 Rugged Shock-resistant Kids Tablets</span>
            <span className="flex items-center gap-2">💻 MacBook Air & Pro M3 Upgrades</span>
            <span className="flex items-center gap-2">⚡ 100% Guaranteed Brand Sealed Boxes</span>
            <span className="flex items-center gap-2">🚀 Same Day Express Shipping</span>
          </div>
        </div>
      </div>

      {/* Hot Deals Gallery & Promo Flyers Section */}
      <section id="deals-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-bold font-mono text-xs uppercase tracking-widest block mb-2">LIMITED TIME AD BUNDLES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              Hot Promotional Deals
            </h2>
            <p className="text-slate-600 mt-3.5 text-sm sm:text-base">
              Swipe or tap on our direct flyer ad cards. Claim these exclusive packages immediately. Manfred dispatches custom VIP bundles right to your device.
            </p>
          </div>

          {/* Flyers Ad Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROMO_FLYERS.map((flyer) => (
              <div 
                key={flyer.id}
                className="group relative bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
                id={`flyer-card-${flyer.id}`}
              >
                
                {/* Visual Image Banner */}
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img 
                    src={flyer.image} 
                    alt={flyer.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
                  
                  {/* Promo Badge Tags */}
                  <div className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{flyer.discountBadge}</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
                    {flyer.category}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-mono font-medium block text-slate-300 uppercase tracking-widest">{flyer.dealEnds}</span>
                    <h3 className="text-lg font-bold block leading-tight mt-0.5">{flyer.title}</h3>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 flex flex-col gap-5 flex-1 justify-between">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {flyer.subtitle}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-rose-500" /> WhatsApp Claim Active
                    </span>
                    <button
                      onClick={() => handleClaimFlyerDeal(flyer)}
                      className="bg-slate-900 group-hover:bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1 hover:shadow-md cursor-pointer"
                    >
                      <span>Claim Deal</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Products Tabbed Grid Section */}
      <section id="products-section" className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-emerald-600 font-bold font-mono text-xs uppercase tracking-widest block mb-1">DEDICATED PREMIUM STOCK</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
                Explore Our Hardware Match
              </h2>
              <p className="text-slate-650 mt-2 text-sm max-w-xl">
                Select your category. Use our live search engine. Toggle between **ZK/USD** in the menu to verify matching values. Add items to cart for bulk discounts.
              </p>
            </div>

            {/* Real-time search form input */}
            <div className="relative w-full max-w-sm shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search specs, iPhones, tablets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-800"
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Scrolling Categories Navigation Bar */}
          <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-none scroll-smooth">
            {[
              { id: 'all', label: 'All Catalog', icon: ShoppingCart },
              { id: 'iphones', label: 'iPhones', icon: Smartphone },
              { id: 'samsung', label: 'Samsung Ultra', icon: Smartphone },
              { id: 'pixels', label: 'Google Pixel', icon: Smartphone },
              { id: 'tablets', label: 'Kids Tablets', icon: Tablet },
              { id: 'laptops', label: 'Laptops', icon: Laptop },
              { id: 'accessories', label: 'Original Gear', icon: Tag }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold whitespace-nowrap transition-all outline-hidden cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                  id={`category-tab-${tab.id}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Actual Filtered Products List */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredProducts.map((product) => {
                const price = currency === 'ZMW' ? product.priceZMW : product.priceUSD;
                const originalPrice = currency === 'ZMW' ? product.originalPriceZMW : product.originalPriceUSD;
                const currencySymbol = currency === 'ZMW' ? 'ZK' : '$';
                const hasDiscount = originalPrice !== undefined && originalPrice > price;

                return (
                  <div 
                    key={product.id}
                    className="group bg-white border border-slate-150 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between"
                    id={`product-card-${product.id}`}
                  >
                    {/* Image showcase wrapper */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                      />
                      
                      {/* Interactive floating elements badges */}
                      {product.isHotDeal && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3 text-slate-950 fill-slate-950" />
                          <span>{product.promoBadge || 'Hot Deal'}</span>
                        </div>
                      )}

                      {/* Stock indicator badge */}
                      <div className="absolute bottom-3 left-3">
                        {product.stockStatus === 'in-stock' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase block">
                            ● In Stock
                          </span>
                        ) : product.stockStatus === 'low-stock' ? (
                          <span className="bg-amber-5 text-amber-700 border border-amber-100 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase block">
                            ⚠️ Selling Out
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-500 border border-slate-100 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase block">
                            🚫 Out of stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta and description content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5 text-left">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">
                          {product.category}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 block leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-slate-550 text-xs leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Grid Features lists */}
                      <ul className="space-y-1 mt-1 border-t border-slate-100 pt-3 text-left">
                        {product.specs.slice(0, 3).map((spec, sIdx) => (
                          <li key={sIdx} className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Pricing block */}
                      <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                        <div className="text-left">
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through block leading-none mb-1">
                              {currencySymbol} {originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-lg font-black text-slate-900 block leading-none font-sans">
                            {currencySymbol} {price.toLocaleString()}
                          </span>
                        </div>
                        
                        <span className="text-[10px] font-mono font-medium text-slate-400">
                          {currency === 'ZMW' ? 'Zambian Kwacha' : 'US Dollar'}
                        </span>
                      </div>

                      {/* Interactive triggers */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => openQuickAdd(product)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleProductWhatsAppInquiry(product)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-center cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto mt-8">
              <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-950">No Devices Found</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                We couldn't find any products matching your search query: <span className="font-mono text-emerald-600 font-bold">"{searchQuery}"</span>. Please double-check spelling or switch category.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="bg-slate-900 text-white font-bold text-xs px-4.5 py-2.5 rounded-xl mt-4 transition-colors hover:bg-slate-800"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* The Quality Promise section */}
      <section id="promise-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold font-mono text-xs uppercase tracking-widest block mb-2">SELE QUALITY STANDARDS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              The Sele Trust Promise
            </h2>
            <p className="text-slate-600 mt-3.5 text-sm sm:text-base">
              Buying electronics in Zambia shouldn't feel risky. Manfred and the Sele Team guarantee transparent specs, verified device authenticity, and lightning-fast local assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Promise 1 */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">100% Genuine Box Sealed</h3>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed text-left">
                Every device is certified original with matching box serials. No fake clones or cheap refurbished parts. We allow live verification at dispatch.
              </p>
            </div>

            {/* Promise 2 */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lusaka Same-day Express</h3>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed text-left">
                Place your cart order and get same-day handling. For Lusaka central areas, our dispatch rider reaches your doorstep in less than 2 hours.
              </p>
            </div>

            {/* Promise 3 */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zambian Wide Shipping</h3>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed text-left">
                We ship completely secure across Kitwe, Ndola, Livingstone, Chipata, and Solwezi. Insurance coverage is fully handled by our delivery partners.
              </p>
            </div>

            {/* Promise 4 */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Direct Manfred Support</h3>
              <p className="text-slate-550 text-xs sm:text-sm leading-relaxed text-left">
                Skip automated bots. You chat directly with our founder Manfred on +260978969098 for real-time video checks, warranties, and special requests.
              </p>
            </div>

          </div>

          {/* Large Trust Stats banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mt-16 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden text-left border border-slate-800 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div className="space-y-3 relative">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold block uppercase">DIRECT SELE EXPERT ADVICE</span>
              <h3 className="text-2xl md:text-3xl font-extrabold uppercase leading-tight max-w-lg">
                Not sure which device fits your study or work?
              </h3>
              <p className="text-slate-300 text-sm max-w-md">
                Ask Manfred for advice. He will recommend the best Kid Tab or laptop matching your specific budget, live over WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/260978969098?text=Hello%20Manfred!%20I%20would%20love%20some%20advice%20on%20buying%20electronics.%20What%20do%20you%20recommend?"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat Live on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-bold font-mono text-xs uppercase tracking-widest block mb-1">VERIFIED USER EXPERIENCES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              What Our Customers Say
            </h2>
            <p className="text-slate-650 mt-2.5 text-sm sm:text-base">
              Real feedback from local students, mothers, business personnel, and technology enthusiasts in Zambia who trade premium devices with Manfred.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6.5 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  {/* Rating block */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                    ))}
                    <span className="text-xs text-slate-400 font-mono ml-2">Verified Buy</span>
                  </div>
                  
                  <p className="text-slate-650 text-sm italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-slate-100 mt-6 text-left">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-extrabold text-sm uppercase">
                    {testimonial.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-950 block leading-tight">{testimonial.name}</span>
                    <span className="text-[11px] text-slate-400 block">{testimonial.role} • <strong className="text-slate-500 font-normal">{testimonial.location}</strong></span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Section & Whatsapp Enquiry Form */}
      <section id="contact-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact details */}
            <div className="lg:col-span-5 text-left space-y-8">
              <div>
                <span className="text-emerald-600 font-bold font-mono text-xs uppercase tracking-widest block mb-2">OFFICE & SHOP ACCESS</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
                  Let's Connect
                </h2>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                  Call or walk-in to our flagship office in Lusaka. Or send us an automated WhatsApp inquiry form right away. Manfred is ready to handle your stock dispatch.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Address block */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 block">OUR SHOP ADDRESS</span>
                    <span className="text-slate-800 text-sm font-semibold block mt-1">{PHYSICAL_SHOP_ADDRESS}</span>
                  </div>
                </div>

                {/* Call block */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 block">DIAL DIRECT / WHATSAPP</span>
                    <span className="text-slate-800 text-sm font-semibold block mt-0.5">{PHONE_NUMBER}</span>
                    <span className="text-slate-500 text-xs block">Consultant: Manfred</span>
                  </div>
                </div>

                {/* Email block */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 block">EMAIL INBOX SUPPORT</span>
                    <span className="text-slate-800 text-sm font-semibold block mt-1">{EMAIL_ADDRESS}</span>
                  </div>
                </div>

              </div>

              {/* Working hours badge */}
              <div className="p-5.5 rounded-2xl bg-emerald-600/5 border border-emerald-500/10 flex items-center gap-4">
                <Clock className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Express Hours Active</h4>
                  <p className="text-slate-600 text-xs mt-0.5">We dispatch orders from 08:00 AM until 06:00 PM every Monday to Saturday.</p>
                </div>
              </div>

            </div>

            {/* Structured Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 border border-slate-150 p-6 sm:p-8 rounded-3xl text-left">
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900 uppercase">Send Direct Shop Enquiry</h3>
                  <p className="text-slate-550 text-xs sm:text-sm mt-1">
                    Fill out the fields. Choose your inquiry subject. Click "Submit" to open a preloaded dialogue box directly in WhatsApp with Manfred.
                  </p>
                </div>

                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 focus-within:text-emerald-600">
                      <label htmlFor="form-name" className="text-xs font-mono font-bold text-slate-500 uppercase">Your Name</label>
                      <input
                        type="text"
                        id="form-name"
                        required
                        placeholder="e.g. Mwamba Banda"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5 focus-within:text-emerald-600">
                      <label htmlFor="form-phone" className="text-xs font-mono font-bold text-slate-500 uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        id="form-phone"
                        required
                        placeholder="e.g. +260 978..."
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 focus-within:text-emerald-600">
                    <label htmlFor="form-subject" className="text-xs font-mono font-bold text-slate-500 uppercase">Enquiry Subject</label>
                    <select
                      id="form-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-850 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium cursor-pointer"
                    >
                      <option value="General Inquiry">General Stock Enquiry</option>
                      <option value="Bulk Order Discount">Bulk Business Pricing</option>
                      <option value="Kids Tablet Pre-installed Apps">Kids Educational Contents Query</option>
                      <option value="Warranty and Repairs">Device Warranty and Care</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 focus-within:text-emerald-600">
                    <label htmlFor="form-message" className="text-xs font-mono font-bold text-slate-500 uppercase">Your Message</label>
                    <textarea
                      id="form-message"
                      rows={4}
                      required
                      placeholder="Type your questions or device expectations here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-850 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Inquiry via WhatsApp</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-slate-900">
            
            {/* Branding Block */}
            <div className="lg:col-span-5 space-y-4">
              <a href="#" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-white font-sans uppercase">
                  SELE <span className="text-emerald-500">ELECTRONICS</span>
                </span>
              </a>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                Zambia's premier digital kiosk for authentic boxes. Buy sealed devices with matching specs and express delivery instantly from Manfred.
              </p>
              <div className="flex gap-4 pt-1 text-xs">
                <span className="text-white font-bold font-mono">100% SECURE SHOPPING HANDLED OVER REAL-TIME WHATSAPP</span>
              </div>
            </div>

            {/* Quick links block */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-slate-200 text-xs font-mono font-bold uppercase tracking-widest">Our Catalog</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><button onClick={() => { setSelectedCategory('iphones'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">Apple iPhones Series</button></li>
                <li><button onClick={() => { setSelectedCategory('samsung'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">Samsung Galaxy Flagships</button></li>
                <li><button onClick={() => { setSelectedCategory('tablets'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">Education Tablets for Toddlers</button></li>
                <li><button onClick={() => { setSelectedCategory('laptops'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">MacBooks & HP Laptops</button></li>
                <li><button onClick={() => { setSelectedCategory('accessories'); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">Genuine Chargers & Accessories</button></li>
              </ul>
            </div>

            {/* Support and Quick contact */}
            <div className="lg:col-span-4 space-y-4 text-xs sm:text-sm">
              <h4 className="text-slate-200 text-xs font-mono font-bold uppercase tracking-widest">Legal & Warranties</h4>
              <ul className="space-y-2">
                <li>• Real 6-Month limited store checks warranty</li>
                <li>• Live video preview and serial check allowed before dispatch</li>
                <li>• 2-Hour Delivery Zone boundaries in Lusaka</li>
                <li>• Certified secure payments on verification</li>
              </ul>
              <div className="pt-2">
                <span className="text-[10px] font-mono block uppercase tracking-wide text-slate-500">CURRENCY ACTIVE</span>
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  {currency === 'ZMW' ? 'Zambian Kwacha (ZMW)' : 'US Dollar (USD) Equivalent'}
                </span>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-slate-550 leading-none">
              &copy; {new Date().getFullYear()} Sele Electronics. All Rights Reserved. Lusaka, Zambia.
            </p>
            <p className="text-slate-600 font-mono leading-none">
              Built with precision for Manfred • Preserving complete offline integrity
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Panel Drawer (Slide-In Slide Panel overlay) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
            
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-950 backdrop-blur-xs cursor-pointer"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-100 text-left">
                  
                  {/* Cart Drawer Title Header */}
                  <div className="flex items-center justify-between border-b border-slate-150 px-6 py-5 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-black text-slate-900 uppercase">Your Kiosk Cart</h3>
                      <span className="bg-emerald-100 text-emerald-850 font-sans text-xs font-bold px-2 py-0.5 rounded-full">
                        {totalItemsCount}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                      id="close-cart-btn"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>
                  </div>

                  {/* Cart Content wrapper container */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cart.length > 0 ? (
                      <div className="space-y-4">
                        {cart.map((item, index) => {
                          const itemPrice = currency === 'ZMW' ? item.product.priceZMW : item.product.priceUSD;
                          const itemTotal = itemPrice * item.quantity;
                          const currencySymbol = currency === 'ZMW' ? 'ZK' : '$';

                          return (
                            <div 
                              key={`${item.product.id}-${index}`}
                              className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex gap-3 relative hover:border-slate-350 transition-colors"
                              id={`cart-item-${item.product.id}-${index}`}
                            >
                              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-205">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                                  {item.product.name}
                                </h4>
                                
                                {item.selectedSpecs && (
                                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                                    {item.selectedSpecs.color && (
                                      <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm font-mono leading-none">
                                        Color: {item.selectedSpecs.color}
                                      </span>
                                    )}
                                    {item.selectedSpecs.storage && (
                                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm font-mono leading-none">
                                        Size: {item.selectedSpecs.storage}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-1.5">
                                  {/* Step Quantity Controls */}
                                  <div className="flex items-center bg-white border border-slate-250 rounded-md p-0.5 scale-90 -ml-2.5">
                                    <button
                                      onClick={() => updateQuantity(index, -1)}
                                      className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2 text-xs font-bold text-slate-800">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(index, 1)}
                                      className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="text-right">
                                    <span className="font-extrabold text-slate-950 text-xs sm:text-sm font-mono block">
                                      {currencySymbol} {itemTotal.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                                      ({currencySymbol} {itemPrice.toLocaleString()} ea)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Remove absolutely from checkout list overlay button */}
                              <button
                                onClick={() => removeFromCart(index)}
                                className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}

                        {/* Interactive Digital Order Information Form */}
                        <form onSubmit={handleCheckoutSubmit} className="border-t border-slate-200 pt-5 mt-6 text-left space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">
                            Step 2: Delivery & Contact details
                          </h4>
                          
                          <div className="space-y-1 focus-within:text-emerald-600">
                            <label htmlFor="customer-name" className="text-[11px] font-mono font-bold text-slate-500 uppercase">Your Fully Legal Name</label>
                            <input
                              type="text"
                              id="customer-name"
                              required
                              placeholder="e.g. Kondwani Phiri"
                              value={orderInfo.customerName}
                              onChange={(e) => setOrderInfo({ ...orderInfo, customerName: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                            />
                          </div>

                          <div className="space-y-1 focus-within:text-emerald-600">
                            <label htmlFor="customer-phone" className="text-[11px] font-mono font-bold text-slate-500 uppercase">Active WhatsApp Phone Number</label>
                            <input
                              type="text"
                              id="customer-phone"
                              required
                              placeholder="e.g. +260 978..."
                              value={orderInfo.customerPhone}
                              onChange={(e) => setOrderInfo({ ...orderInfo, customerPhone: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                            />
                          </div>

                          <div className="space-y-1 focus-within:text-emerald-600">
                            <label htmlFor="customer-location" className="text-[11px] font-mono font-bold text-slate-500 uppercase">Delivery Address / Shop Pickup Zone</label>
                            <input
                              type="text"
                              id="customer-location"
                              required
                              placeholder="e.g. Woodlands Main Road, Lusaka"
                              value={orderInfo.customerLocation}
                              onChange={(e) => setOrderInfo({ ...orderInfo, customerLocation: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                            />
                          </div>

                          {/* Fulfillment strategy choice controls */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block">Preferred Dispatch Strategy</span>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setOrderInfo({ ...orderInfo, deliveryMethod: 'delivery' })}
                                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${orderInfo.deliveryMethod === 'delivery' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                              >
                                Delivery (Express)
                              </button>
                              <button
                                type="button"
                                onClick={() => setOrderInfo({ ...orderInfo, deliveryMethod: 'pickup' })}
                                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${orderInfo.deliveryMethod === 'pickup' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                              >
                                Walk-in Shop Pickup
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 focus-within:text-emerald-600">
                            <label htmlFor="order-notes" className="text-[11px] font-mono font-bold text-slate-500 uppercase">Special Instructions / Custom Notes</label>
                            <input
                              type="text"
                              id="order-notes"
                              placeholder="e.g. Wrap as birthday gift, include glass protector..."
                              value={orderInfo.notes}
                              onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                            />
                          </div>

                          {/* Order Action Button */}
                          <button
                            type="submit"
                            disabled={orderSubmitted}
                            className={`w-full text-white font-bold py-4 px-4 rounded-xl mt-4 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 ${orderSubmitted ? 'bg-slate-500' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span>
                              {orderSubmitted ? "Composing Order Dialogue..." : "Order instantly on WhatsApp"}
                            </span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <ShoppingCart className="w-14 h-14 text-slate-300 mb-4" />
                        <h4 className="text-base font-extrabold text-slate-950 uppercase">Cart is Completely Empty</h4>
                        <p className="text-slate-500 text-xs mt-2 max-w-xs leading-relaxed">
                          Verify premium catalog of smartphones and educational tablets. Add high-performance electronics to start ordering.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-4 transition-colors"
                        >
                          Continue Browsing Tech
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pricing Subtotal Panel Footer inside drawer */}
                  {cart.length > 0 && (
                    <div className="border-t border-slate-200 px-6 py-5 bg-slate-50 space-y-3 shrink-0">
                      <div className="flex justify-between text-slate-500 text-xs font-semibold uppercase">
                        <span>Items Subtotal:</span>
                        <span>{currency === 'ZMW' ? 'ZK' : '$'} {totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-xs font-semibold uppercase -mt-1">
                        <span>Delivery Fee (Lusaka):</span>
                        <span className="text-emerald-600 font-bold font-mono">FREE DESK MATCH</span>
                      </div>
                      <div className="flex justify-between text-slate-900 text-base font-black uppercase pt-1 border-t border-slate-200">
                        <span>Grand Total:</span>
                        <span>{currency === 'ZMW' ? 'ZK' : '$'} {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Quick Customize / Order Item Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" id="quick-view-modal">
            
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-slate-950 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Panel content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 text-left shadow-2xl space-y-5"
            >
              {/* Close Button tag */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-sm">
                  {quickViewProduct.category}
                </span>
                
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                  {quickViewProduct.name}
                </h3>
                
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Pricing tags */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Sele Special Sealed Price</span>
                    <span className="text-lg font-black text-slate-900 font-sans">
                      {currency === 'ZMW' ? 'ZK' : '$'} {(currency === 'ZMW' ? quickViewProduct.priceZMW : quickViewProduct.priceUSD).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">● Verified Original</span>
                  </div>
                </div>

                {/* Specs Choice variables list */}
                <div className="space-y-4 pt-2">
                  
                  {/* Color Selector */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">Choose Color:</span>
                    <div className="flex flex-wrap gap-2">
                      {getProductSpecsSuggestions(quickViewProduct).colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`text-xs px-3.5 py-2 rounded-lg border font-bold transition-all cursor-pointer ${selectedColor === color ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-800'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Storage Size Selector (Only if available) */}
                  {getProductSpecsSuggestions(quickViewProduct).storage.length > 0 && (
                    <div className="space-y-1.5 text-left">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase">Choose Storage Size:</span>
                      <div className="flex flex-wrap gap-2">
                        {getProductSpecsSuggestions(quickViewProduct).storage.map((storage) => (
                          <button
                            key={storage}
                            type="button"
                            onClick={() => setSelectedStorage(storage)}
                            className={`text-xs px-3.5 py-2 rounded-lg border font-bold transition-all cursor-pointer ${selectedStorage === storage ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-800'}`}
                          >
                            {storage}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Final Interactive Action Panel */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer text-center text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addToCart(quickViewProduct, { color: selectedColor, storage: selectedStorage })}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
                    <span>Confirm Add to Cart</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
