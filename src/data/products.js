// Demo catalogue: 7 categories x 8 products. Photo file names are listed in docs/IMAGE-PROMPTS.md.

export const categories = [
  { id: 'fashion', emoji: '👗', name: { en: 'Fashion', bn: 'ফ্যাশন' }, hue: '#8B5CF6' },
  { id: 'electronics', emoji: '🎧', name: { en: 'Electronics', bn: 'ইলেকট্রনিক্স' }, hue: '#3B82F6' },
  { id: 'beauty', emoji: '💄', name: { en: 'Beauty', bn: 'বিউটি' }, hue: '#EC4899' },
  { id: 'home', emoji: '🛋️', name: { en: 'Home & Living', bn: 'হোম ও লিভিং' }, hue: '#F59E0B' },
  { id: 'sports', emoji: '⚽', name: { en: 'Sports', bn: 'স্পোর্টস' }, hue: '#10B981' },
  { id: 'kids', emoji: '🧸', name: { en: 'Toys & Kids', bn: 'খেলনা ও শিশু' }, hue: '#F97316' },
  { id: 'grocery', emoji: '🛒', name: { en: 'Grocery', bn: 'গ্রোসারি' }, hue: '#22C55E' },
]

// Every product looks for public/images/products/<id>.jpg. If the file is missing,
// the glowing icon is shown instead, so photos can be added one at a time.
const p = (id, cat, emoji, en, bn, price, old, rating, reviews, extra = {}) => ({
  id, cat, emoji, name: { en, bn }, price, old, rating, reviews, stock: 25,
  image: `images/products/${id}.jpg`, ...extra,
})

export const products = [
  p('anc-headphones', 'electronics', '🎧', 'Wireless Noise Cancelling Headphones', 'ওয়্যারলেস নয়েজ ক্যান্সেলিং হেডফোন', 4990, 6500, 4.8, 1240, { badge: 'hot', tags: ['flash', 'trending'] }),
  p('smart-watch-pro', 'electronics', '⌚', 'Smart Fitness Watch Pro', 'স্মার্ট ফিটনেস ওয়াচ প্রো', 7450, 9900, 4.9, 860, { tags: ['flash', 'recommended'] }),
  p('earbuds-x', 'electronics', '🎵', 'True Wireless Earbuds X', 'ট্রু ওয়্যারলেস ইয়ারবাডস X', 2490, 3200, 4.6, 2010, { tags: ['recommended'] }),
  p('bt-speaker', 'electronics', '🔊', 'Portable Bluetooth Speaker', 'পোর্টেবল ব্লুটুথ স্পিকার', 3290, 4500, 4.7, 540, { tags: ['flash'] }),
  p('phone-x12', 'electronics', '📱', 'Nova X12 Smartphone 8/256GB', 'নোভা X12 স্মার্টফোন ৮/২৫৬GB', 32990, 36500, 4.7, 410, { badge: 'new', tags: ['trending'] }),
  p('laptop-air', 'electronics', '💻', 'AirBook 14" Laptop', 'এয়ারবুক ১৪" ল্যাপটপ', 74500, 82000, 4.8, 190, { tags: ['recommended'] }),
  p('power-bank', 'electronics', '🔋', 'Fast Charging Power Bank 20000mAh', 'ফাস্ট চার্জিং পাওয়ার ব্যাংক ২০০০০mAh', 1890, 2500, 4.6, 1420 ),
  p('tablet-10', 'electronics', '📲', 'Nova Tab 10" Tablet', 'নোভা ট্যাব ১০" ট্যাবলেট', 21990, 25500, 4.6, 260, { badge: 'new' }),

  p('denim-jacket', 'fashion', '🧥', 'Oversized Denim Jacket', 'ওভারসাইজড ডেনিম জ্যাকেট', 2850, 3600, 4.6, 320, { sizes: ['S', 'M', 'L', 'XL'], tags: ['trending'] }),
  p('linen-shirt', 'fashion', '👕', 'Linen Relaxed Shirt', 'লিনেন রিল্যাক্সড শার্ট', 1590, 1990, 4.7, 890, { sizes: ['S', 'M', 'L', 'XL'], tags: ['recommended'] }),
  p('street-sneakers', 'fashion', '👟', 'Street Style Sneakers', 'স্ট্রিট স্টাইল স্নিকার্স', 3290, 4200, 4.6, 1500, { sizes: ['39', '40', '41', '42', '43'], badge: 'hot', tags: ['flash', 'recommended'] }),
  p('summer-dress', 'fashion', '👗', 'Floral Summer Dress', 'ফ্লোরাল সামার ড্রেস', 2190, 2900, 4.8, 610, { sizes: ['S', 'M', 'L'], tags: ['recommended'] }),
  p('leather-tote', 'fashion', '👜', 'Leather Tote Bag', 'লেদার টোট ব্যাগ', 3990, 4990, 4.8, 275, { tags: ['trending'] }),
  p('panjabi', 'fashion', '🥻', 'Cotton Panjabi Classic', 'কটন পাঞ্জাবি ক্লাসিক', 1890, 2400, 4.7, 730, { sizes: ['M', 'L', 'XL', 'XXL'], badge: 'new' }),

  p('cotton-saree', 'fashion', '🥻', 'Handloom Cotton Saree', 'হ্যান্ডলুম কটন শাড়ি', 2650, 3400, 4.8, 540, { tags: ['trending'] }),
  p('sunglasses', 'fashion', '🕶️', 'Polarized Aviator Sunglasses', 'পোলারাইজড এভিয়েটর সানগ্লাস', 1290, 1800, 4.5, 380 ),

  p('glow-serum', 'beauty', '🧴', 'Vitamin C Glow Serum', 'ভিটামিন সি গ্লো সিরাম', 1150, 1600, 4.7, 1820, { tags: ['flash', 'recommended'] }),
  p('matte-lipstick', 'beauty', '💄', 'Velvet Matte Lipstick', 'ভেলভেট ম্যাট লিপস্টিক', 650, 850, 4.5, 960 ),
  p('amber-perfume', 'beauty', '🌸', 'Amber Bloom Eau de Parfum', 'অ্যাম্বার ব্লুম পারফিউম', 2950, 3800, 4.6, 420, { tags: ['trending'] }),
  p('skincare-kit', 'beauty', '✨', 'Daily Skincare Kit', 'ডেইলি স্কিনকেয়ার কিট', 2450, 3200, 4.8, 350, { badge: 'new' }),

  p('sunscreen', 'beauty', '☀️', 'Sunscreen SPF 50 PA++++', 'সানস্ক্রিন SPF 50 PA++++', 890, 1150, 4.7, 1100, { tags: ['recommended'] }),
  p('eyeshadow-palette', 'beauty', '🎨', 'Nude Eyeshadow Palette', 'ন্যুড আইশ্যাডো প্যালেট', 1350, 1750, 4.6, 450 ),
  p('face-wash', 'beauty', '🫧', 'Gentle Foaming Face Wash', 'জেন্টল ফোমিং ফেস ওয়াশ', 490, 650, 4.6, 1650 ),
  p('hair-dryer', 'beauty', '💨', 'Ionic Hair Dryer 1800W', 'আয়নিক হেয়ার ড্রায়ার ১৮০০W', 2390, 3100, 4.5, 330 ),

  p('accent-chair', 'home', '🪑', 'Velvet Accent Chair', 'ভেলভেট অ্যাকসেন্ট চেয়ার', 12500, 15900, 4.7, 88, { tags: ['recommended'] }),
  p('aroma-diffuser', 'home', '🕯️', 'Aroma Diffuser with LED Light', 'এলইডি অ্যারোমা ডিফিউজার', 1990, 2600, 4.6, 640, { tags: ['flash'] }),
  p('desk-organizer', 'home', '🪴', 'Minimal Desk Organizer', 'মিনিমাল ডেস্ক অর্গানাইজার', 890, 1200, 4.6, 230 ),
  p('cookware-set', 'home', '🍳', 'Nonstick Cookware Set', 'ননস্টিক কুকওয়্যার সেট', 4290, 5500, 4.6, 310, { tags: ['trending'] }),

  p('table-lamp', 'home', '💡', 'Modern Table Lamp', 'মডার্ন টেবিল ল্যাম্প', 1650, 2200, 4.6, 290 ),
  p('bedsheet-set', 'home', '🛏️', 'Cotton Bedsheet Set (King)', 'কটন বেডশিট সেট (কিং)', 2190, 2900, 4.7, 760, { tags: ['recommended'] }),
  p('wall-clock', 'home', '🕰️', 'Minimal Wall Clock', 'মিনিমাল ওয়াল ক্লক', 990, 1400, 4.5, 210 ),
  p('ceramic-vase', 'home', '🏺', 'Ceramic Flower Vase', 'সিরামিক ফুলদানি', 850, 1150, 4.6, 180, { badge: 'new' }),

  p('football-pro', 'sports', '⚽', 'Pro Match Football', 'প্রো ম্যাচ ফুটবল', 1450, 1900, 4.7, 520 ),
  p('yoga-mat', 'sports', '🧘', 'Non-slip Yoga Mat', 'নন-স্লিপ ইয়োগা ম্যাট', 1250, 1600, 4.6, 410, { tags: ['recommended'] }),
  p('cricket-bat', 'sports', '🏏', 'English Willow Cricket Bat', 'ইংলিশ উইলো ক্রিকেট ব্যাট', 4590, 5900, 4.8, 340, { tags: ['trending'] }),
  p('badminton-set', 'sports', '🏸', 'Badminton Racket Set', 'ব্যাডমিন্টন র‍্যাকেট সেট', 1790, 2400, 4.6, 480 ),
  p('dumbbells', 'sports', '🏋️', 'Adjustable Dumbbells 10kg', 'অ্যাডজাস্টেবল ডাম্বেল ১০ কেজি', 3290, 4200, 4.7, 260 ),
  p('running-shoes', 'sports', '👟', 'Lightweight Running Shoes', 'লাইটওয়েট রানিং শু', 3890, 4900, 4.7, 610, { sizes: ['39', '40', '41', '42', '43', '44'], tags: ['recommended'] }),
  p('water-bottle', 'sports', '🧴', 'Insulated Steel Water Bottle', 'ইনসুলেটেড স্টিল পানির বোতল', 790, 1050, 4.7, 920 ),
  p('cycling-helmet', 'sports', '⛑️', 'Cycling Safety Helmet', 'সাইক্লিং সেফটি হেলমেট', 1990, 2600, 4.6, 150 ),

  p('teddy-bear', 'kids', '🧸', 'Soft Teddy Bear (Large)', 'সফট টেডি বিয়ার (বড়)', 1350, 1800, 4.9, 670 ),
  p('building-blocks', 'kids', '🧩', 'Creative Building Blocks', 'ক্রিয়েটিভ বিল্ডিং ব্লকস', 1690, 2200, 4.8, 290, { badge: 'new' }),
  p('rc-car', 'kids', '🏎️', 'Remote Control Racing Car', 'রিমোট কন্ট্রোল রেসিং কার', 2290, 2990, 4.7, 410, { tags: ['trending'] }),
  p('school-bag', 'kids', '🎒', 'Kids School Backpack', 'বাচ্চাদের স্কুল ব্যাগ', 1490, 1900, 4.7, 580 ),
  p('art-kit', 'kids', '🖍️', 'Kids Art & Colouring Kit', 'বাচ্চাদের আর্ট ও রং করার কিট', 990, 1350, 4.8, 360 ),
  p('baby-romper', 'kids', '👶', 'Soft Cotton Baby Romper', 'সফট কটন বেবি রম্পার', 690, 950, 4.8, 470, { sizes: ['0-6M', '6-12M', '12-18M'] }),
  p('plush-bunny', 'kids', '🐰', 'Plush Bunny Soft Toy', 'প্লাশ খরগোশ সফট টয়', 890, 1200, 4.9, 300 ),
  p('wooden-puzzle', 'kids', '🧩', 'Wooden Learning Puzzle', 'কাঠের লার্নিং পাজল', 750, 990, 4.7, 220, { badge: 'new' }),

  p('premium-tea', 'grocery', '🍵', 'Premium Sylhet Tea 500g', 'প্রিমিয়াম সিলেট চা ৫০০ গ্রাম', 420, 520, 4.8, 1330 ),
  p('honey', 'grocery', '🍯', 'Pure Sundarban Honey 500g', 'খাঁটি সুন্দরবনের মধু ৫০০ গ্রাম', 750, 900, 4.9, 980, { tags: ['trending'] }),
  p('basmati-rice', 'grocery', '🍚', 'Premium Basmati Rice 5kg', 'প্রিমিয়াম বাসমতি চাল ৫ কেজি', 1450, 1650, 4.7, 870 ),
  p('mustard-oil', 'grocery', '🫗', 'Pure Mustard Oil 1L', 'খাঁটি সরিষার তেল ১ লিটার', 320, 380, 4.8, 1240 ),
  p('mixed-nuts', 'grocery', '🥜', 'Premium Mixed Nuts 500g', 'প্রিমিয়াম মিক্সড বাদাম ৫০০ গ্রাম', 990, 1250, 4.7, 540, { tags: ['recommended'] }),
  p('coffee-beans', 'grocery', '☕', 'Roasted Coffee Beans 250g', 'রোস্টেড কফি বিনস ২৫০ গ্রাম', 850, 1100, 4.6, 390 ),
  p('dates', 'grocery', '🌴', 'Premium Ajwa Dates 500g', 'প্রিমিয়াম আজওয়া খেজুর ৫০০ গ্রাম', 1250, 1500, 4.9, 760, { badge: 'hot' }),
  p('ghee', 'grocery', '🧈', 'Pure Cow Ghee 400g', 'খাঁটি গাওয়া ঘি ৪০০ গ্রাম', 890, 1050, 4.8, 610 ),
]

export const findProduct = (id) => products.find((x) => x.id === id)
export const categoryOf = (id) => categories.find((c) => c.id === id)
export const discount = (pr) => Math.round((1 - pr.price / pr.old) * 100)

export const coupons = {
  WELCOME20: { type: 'percent', value: 20, min: 1000 },
  ANAQIA100: { type: 'flat', value: 100, min: 1500 },
}

export const delivery = { inside: 60, outside: 120, freeOver: 3000 }

export const districts = [
  'Dhaka', 'Chattogram', 'Gazipur', 'Narayanganj', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal',
  'Rangpur', 'Mymensingh', 'Cumilla', 'Bogura', "Cox's Bazar", 'Jessore', 'Dinajpur', 'Tangail',
]
