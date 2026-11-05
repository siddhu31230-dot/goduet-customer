import { Restaurant, FreshProduct, HyderabadLocation } from '@/types';

export const HYDERABAD_LOCATIONS: HyderabadLocation[] = [
  { id: 'jubilee-hills', name: 'Jubilee Hills', area: 'Road No. 36 & 45', pincode: '500033', isPopular: true, zone: 'Central Hyderabad' },
  { id: 'banjara-hills', name: 'Banjara Hills', area: 'Road No. 1, 10 & 12', pincode: '500034', isPopular: true, zone: 'Central Hyderabad' },
  { id: 'hitec-city', name: 'Hitec City', area: 'Cyber Towers, Mindspace', pincode: '500081', isPopular: true, zone: 'Cyberabad' },
  { id: 'madhapur', name: 'Madhapur', area: 'Ayyappa Society, Kavuri Hills', pincode: '500081', isPopular: true, zone: 'Cyberabad' },
  { id: 'gachibowli', name: 'Gachibowli', area: 'DLF Cybercity, Financial Dist', pincode: '500032', isPopular: true, zone: 'Cyberabad' },
  { id: 'kondapur', name: 'Kondapur', area: 'Kothaguda, Botanical Garden', pincode: '500084', isPopular: true, zone: 'West Hyderabad' },
  { id: 'begumpet', name: 'Begumpet', area: 'Prakash Nagar, SP Road', pincode: '500016', isPopular: false, zone: 'North Hyderabad' },
  { id: 'secunderabad', name: 'Secunderabad', area: 'Clock Tower, PG Road', pincode: '500003', isPopular: false, zone: 'North Hyderabad' },
  { id: 'kukatpally', name: 'Kukatpally', area: 'KPHB Colony, Forum Mall', pincode: '500072', isPopular: false, zone: 'West Hyderabad' },
  { id: 'iiit-campus', name: 'IIIT Hyderabad Campus', area: 'Gachibowli Main Rd', pincode: '500032', isPopular: true, zone: 'Cyberabad' },
];

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest-bawarchi',
    name: 'Bawarchi Heritage Dum Biryani',
    tagline: 'Authentic Charcoal Slow-Cooked Hyderabadi Dum Delicacies',
    cuisines: ['Biryani', 'Mughlai', 'North Indian'],
    rating: 4.8,
    ratingCount: 14200,
    deliveryTimeMins: 32,
    distanceKm: 2.4,
    costForTwo: 550,
    locality: 'Madhapur / Hitec City',
    address: 'Plot 42, Hitec City Main Road, Cyberabad, Hyderabad',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-thickshake', 'rest-concu', 'rest-waffle'],
    duetSpeciality: 'Pairs best with ThickShake Factory or Conçù desserts',
    featuredOffer: 'Flat ₹100 OFF on Duet Orders',
    isPureVeg: false,
    menuCategories: ['Bestsellers', 'Royal Biryanis', 'Tandoor Starters', 'Desserts & Beverages'],
    menu: [
      {
        id: 'bw-1',
        name: 'Hyderabadi Nizami Mutton Dum Biryani',
        description: 'Tender baby goat slow-cooked with aged Basmati rice, saffron, and heirloom aromatic spices. Served with Mirchi Ka Salan and creamy Raita.',
        price: 389,
        originalPrice: 429,
        type: 'non-veg',
        category: 'Royal Biryanis',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 8420,
        isBestseller: true,
        isDuetFavorite: true,
        spicyLevel: 2,
        prepTimeMinutes: 20
      },
      {
        id: 'bw-2',
        name: 'Special Chicken Dum Biryani',
        description: 'Fragrant saffron-infused long grain rice layered with marinated succulent chicken pieces and boiled egg. Truly authentic.',
        price: 329,
        originalPrice: 360,
        type: 'non-veg',
        category: 'Royal Biryanis',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 11200,
        isBestseller: true,
        isDuetFavorite: true,
        spicyLevel: 2,
        prepTimeMinutes: 18
      },
      {
        id: 'bw-3',
        name: 'Hyderabadi Chicken 65 (Crispy Red)',
        description: 'Crispy deep-fried chicken tossed in curry leaves, green chilies, yogurt, and authentic spicy red masala.',
        price: 289,
        type: 'non-veg',
        category: 'Tandoor Starters',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        votes: 4320,
        isBestseller: true,
        spicyLevel: 3,
        prepTimeMinutes: 15
      },
      {
        id: 'bw-4',
        name: 'Shahi Paneer Subz Dum Biryani',
        description: 'Fresh malai paneer cubes, garden vegetables and aromatic Basmati cooked under slow steam. Served with fresh raita.',
        price: 289,
        type: 'veg',
        category: 'Royal Biryanis',
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=600&auto=format&fit=crop&q=80',
        rating: 4.6,
        votes: 2100,
        prepTimeMinutes: 18
      },
      {
        id: 'bw-5',
        name: 'Classic Double Ka Meetha',
        description: 'Traditional Hyderabadi bread pudding soaked in saffron saffron rabri, ghee-fried dry fruits and cardamom.',
        price: 149,
        type: 'veg',
        category: 'Desserts & Beverages',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 1980,
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'rest-concu',
    name: 'Conçù Artisan Patisserie & Café',
    tagline: 'European Pastries, French Macarons & Artisanal Cold Brews',
    cuisines: ['Desserts', 'Bakery', 'Beverages', 'Continental'],
    rating: 4.9,
    ratingCount: 8900,
    deliveryTimeMins: 28,
    distanceKm: 2.1,
    costForTwo: 600,
    locality: 'Jubilee Hills / Madhapur',
    address: 'Road No. 37, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-bawarchi', 'rest-little-italy', 'rest-chutneys'],
    duetSpeciality: 'The ideal sweet finale paired with your Biryani or Pizza order',
    featuredOffer: 'Free Salted Caramel Éclair on Duet orders above ₹699',
    isPureVeg: false,
    menuCategories: ['Signature Pastries', 'Tiramisu & Cakes', 'Artisan Coffee & Shakes', 'Gourmet Bites'],
    menu: [
      {
        id: 'cc-1',
        name: 'Signature Roman Tiramisu Jar',
        description: 'Espresso-soaked savoiardi sponge layered with velvety mascarpone cream and dusted with Valrhona cocoa.',
        price: 320,
        type: 'egg',
        category: 'Tiramisu & Cakes',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 3800,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 12
      },
      {
        id: 'cc-2',
        name: 'Dark Chocolate Truffle Tartlet',
        description: '70% Belgian dark chocolate ganache encased in a crisp almond sablé crust, finished with gold leaf.',
        price: 240,
        type: 'veg',
        category: 'Signature Pastries',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 2450,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 10
      },
      {
        id: 'cc-3',
        name: 'Spanish Iced Latte with Condensed Milk',
        description: 'Double shot of single-origin arabica espresso shaken over ice with cold textured milk and dulce condensed milk.',
        price: 220,
        type: 'veg',
        category: 'Artisan Coffee & Shakes',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 1890,
        prepTimeMinutes: 8
      },
      {
        id: 'cc-4',
        name: 'Box of 6 Parisian Macarons',
        description: 'Assorted flavors: Pistachio, Madagascar Vanilla, Salted Caramel, Dark Raspberry, Nutella and Lavender.',
        price: 490,
        type: 'egg',
        category: 'Signature Pastries',
        image: 'https://images.unsplash.com/photo-1569864321390-dc0865c329b3?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 1540,
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'rest-thickshake',
    name: 'The ThickShake Factory',
    tagline: 'Premium Handcrafted Shakes & Slushies',
    cuisines: ['Beverages', 'Desserts', 'Fast Food'],
    rating: 4.7,
    ratingCount: 16500,
    deliveryTimeMins: 25,
    distanceKm: 1.8,
    costForTwo: 350,
    locality: 'Madhapur',
    address: 'Near Inorbit Mall, Mindspace Road, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-bawarchi', 'rest-burger-lab', 'rest-little-italy'],
    duetSpeciality: 'Kept chilled in GoDuet dual-temp thermal bags next to piping hot meals',
    featuredOffer: 'Buy 1 Get 1 on Belgian Chocolate Shake',
    isPureVeg: true,
    menuCategories: ['Classic Shakes', 'Premium Shakes', 'Fruit Blends'],
    menu: [
      {
        id: 'ts-1',
        name: 'Belgian Chocolate Super Thick Shake',
        description: 'Loaded with dense Belgian chocolate fudge, rich dairy cream, and crushed chocolate nibs.',
        price: 219,
        originalPrice: 249,
        type: 'veg',
        category: 'Premium Shakes',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 6800,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 8
      },
      {
        id: 'ts-2',
        name: 'Ferrero Rocher Hazelnut Dream',
        description: 'Whole Ferrero Rocher truffles blended with Nutella, roasted hazelnuts and chocolate fudge cream.',
        price: 249,
        type: 'veg',
        category: 'Premium Shakes',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 5200,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 8
      },
      {
        id: 'ts-3',
        name: 'Alphonso Mango Real Pulp Shake',
        description: 'Pure Ratnagiri Alphonso mango pulp blended with rich ice cream and topped with fresh mango cubes.',
        price: 199,
        type: 'veg',
        category: 'Fruit Blends',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        votes: 2900,
        prepTimeMinutes: 8
      }
    ]
  },
  {
    id: 'rest-little-italy',
    name: 'Little Italy Wood-Fired Trattoria',
    tagline: 'Artisanal Neapolitan Sourdough Pizzas & Hand-Rolled Pastas',
    cuisines: ['Pizza', 'Italian', 'Continental'],
    rating: 4.7,
    ratingCount: 5200,
    deliveryTimeMins: 35,
    distanceKm: 3.2,
    costForTwo: 800,
    locality: 'Jubilee Hills',
    address: 'Road No. 92, Film Nagar, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-concu', 'rest-thickshake', 'rest-waffle'],
    duetSpeciality: 'Fresh oven-hot crust paired with cold shakes or gourmet desserts',
    featuredOffer: 'Flat 20% OFF on all Sourdough Pizzas',
    isPureVeg: true,
    menuCategories: ['Neapolitan Pizzas', 'Handcrafted Pastas', 'Starters & Breads'],
    menu: [
      {
        id: 'li-1',
        name: 'Tartufata Truffle & Wild Mushroom Pizza (11")',
        description: '48-hour fermented sourdough base, San Marzano tomato sauce, fior di latte mozzarella, sautéed porcini mushrooms, and white truffle oil.',
        price: 495,
        originalPrice: 550,
        type: 'veg',
        category: 'Neapolitan Pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 1890,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 20
      },
      {
        id: 'li-2',
        name: 'Quattro Formaggi Four Cheese Pizza (11")',
        description: 'Mozzarella, Gorgonzola blue, smoked scamorza, and aged parmigiano reggiano with fresh basil and oregano.',
        price: 475,
        type: 'veg',
        category: 'Neapolitan Pizzas',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 1420,
        isBestseller: true,
        prepTimeMinutes: 18
      },
      {
        id: 'li-3',
        name: 'Penne alla Vodka & Sundried Tomato',
        description: 'Al dente penne tossed in rich pink vodka sauce, toasted pine nuts, and kalamata olives.',
        price: 395,
        type: 'veg',
        category: 'Handcrafted Pastas',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        votes: 980,
        prepTimeMinutes: 16
      }
    ]
  },
  {
    id: 'rest-burger-lab',
    name: 'The Hyderabad Smash Burger Co.',
    tagline: 'Lava Grilled Gourmet Burgers, Loaded Fries & Tenders',
    cuisines: ['Burgers', 'Fast Food', 'American', 'Beverages'],
    rating: 4.6,
    ratingCount: 7800,
    deliveryTimeMins: 26,
    distanceKm: 2.7,
    costForTwo: 450,
    locality: 'Gachibowli / Hitec City',
    address: 'Opposite DLF Cybercity Gate 2, Gachibowli, Hyderabad',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-thickshake', 'rest-waffle'],
    duetSpeciality: 'Student hot-pick: Smash burger paired with a thick shake at student discount',
    featuredOffer: 'Student Special: Free Peri Peri Fries with any Burger',
    isPureVeg: false,
    menuCategories: ['Smash Burgers', 'Loaded Sides', 'Crispy Tenders'],
    menu: [
      {
        id: 'bl-1',
        name: 'The Double Bacon-Cheddar Smash Burger',
        description: 'Two smashed tender patties, molten sharp cheddar, caramelized onions, homemade secret sauce, toasted brioche bun.',
        price: 299,
        originalPrice: 349,
        type: 'non-veg',
        category: 'Smash Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 3400,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 14
      },
      {
        id: 'bl-2',
        name: 'Crispy Korean Gochujang Fried Chicken Burger',
        description: 'Buttermilk fried chicken breast glazed in sweet-spicy gochujang, pickled cucumber, and kimchi slaw.',
        price: 279,
        type: 'non-veg',
        category: 'Smash Burgers',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
        rating: 4.7,
        votes: 2190,
        isBestseller: true,
        prepTimeMinutes: 14
      },
      {
        id: 'bl-3',
        name: 'Truffle Parmesan Loaded Crinkle Fries',
        description: 'Crispy skin-on crinkle fries drizzled with truffle garlic aioli, grated parmesan, and chopped chives.',
        price: 179,
        type: 'veg',
        category: 'Loaded Sides',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
        rating: 4.6,
        votes: 1650,
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'rest-chutneys',
    name: 'Chutneys Heritage South Indian',
    tagline: 'Legendary Guntur Idlis, Babai Hotel Dosas & 7 Chutneys',
    cuisines: ['South Indian', 'Snacks', 'Beverages'],
    rating: 4.8,
    ratingCount: 19800,
    deliveryTimeMins: 24,
    distanceKm: 1.9,
    costForTwo: 350,
    locality: 'Banjara Hills',
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-concu', 'rest-almond-house'],
    duetSpeciality: 'Pair crisp breakfast dosas with freshly ground filter coffee and sweets',
    featuredOffer: 'Signature 7 Chutneys complimentary with all Dosa orders',
    isPureVeg: true,
    menuCategories: ['Steamed Idlis', 'Signature Dosas', 'Tiffin Combos', 'Filter Kaapi'],
    menu: [
      {
        id: 'ch-1',
        name: 'Guntur Karam Butter Steam Idli (4 pcs)',
        description: 'Melt-in-mouth soft button idlis smeared with authentic spicy Guntur red podi and pure cow ghee. Served with 7 distinct chutneys.',
        price: 165,
        type: 'veg',
        category: 'Steamed Idlis',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 7200,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 10
      },
      {
        id: 'ch-2',
        name: 'Babai Hotel Ghee Paneer Dosa',
        description: 'Crispy golden crepe roasted in dollops of pure butter and white butter, stuffed with spiced cottage cheese and cashew nut masala.',
        price: 210,
        type: 'veg',
        category: 'Signature Dosas',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 5600,
        isBestseller: true,
        prepTimeMinutes: 12
      },
      {
        id: 'ch-3',
        name: 'Degree Filter Kaapi (Brass Tumbler)',
        description: 'Chicory-blended dark roast Chikmagalur coffee brewed freshly through traditional brass drip filter with frothed whole milk.',
        price: 75,
        type: 'veg',
        category: 'Filter Kaapi',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 3900,
        prepTimeMinutes: 6
      }
    ]
  },
  {
    id: 'rest-waffle',
    name: 'The Belgian Waffle Co.',
    tagline: 'Warm Crispy Waffle Sandwiches & Sundaes',
    cuisines: ['Desserts', 'Snacks', 'Bakery'],
    rating: 4.7,
    ratingCount: 11400,
    deliveryTimeMins: 22,
    distanceKm: 1.5,
    costForTwo: 300,
    locality: 'Madhapur',
    address: 'Near Durgam Cheruvu Metro, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-bawarchi', 'rest-burger-lab', 'rest-little-italy'],
    duetSpeciality: 'The ultimate late-night warm dessert add-on',
    featuredOffer: '₹75 OFF on Triple Chocolate Waffle',
    isPureVeg: true,
    menuCategories: ['Waffle Sandwiches', 'Mini Pancakes', 'Waffle Cakes'],
    menu: [
      {
        id: 'bw-w1',
        name: 'Triple Chocolate Overload Waffle',
        description: 'Dark chocolate waffle batter filled with melted white chocolate, milk chocolate ganache and dark chocolate fudge.',
        price: 180,
        originalPrice: 210,
        type: 'veg',
        category: 'Waffle Sandwiches',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 4900,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 10
      },
      {
        id: 'bw-w2',
        name: 'Red Velvet Cream Cheese Waffle',
        description: 'Crispy red velvet waffle base stuffed with Philadelphia cream cheese spread and melted white chocolate.',
        price: 170,
        type: 'veg',
        category: 'Waffle Sandwiches',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 3100,
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'rest-almond-house',
    name: 'Almond House Hyderabad',
    tagline: 'Iconic Bisticks, Bellam Jalebi & Royal Mithai',
    cuisines: ['Desserts', 'Snacks', 'Indian Sweets'],
    rating: 4.9,
    ratingCount: 13200,
    deliveryTimeMins: 26,
    distanceKm: 2.3,
    costForTwo: 450,
    locality: 'Banjara Hills',
    address: 'Road No. 36, Banjara Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80',
    isDuetEligible: true,
    duetPartners: ['rest-chutneys', 'rest-bawarchi'],
    duetSpeciality: 'Pairs sweet Hyderabadi nostalgia with South Indian breakfasts or Biryanis',
    featuredOffer: 'Complementary 100g Bistick pack with orders over ₹500',
    isPureVeg: true,
    menuCategories: ['Signature Bisticks', 'Pure Ghee Sweets', 'Namkeen & Savouries'],
    menu: [
      {
        id: 'ah-1',
        name: 'The Original Almond Bisticks (250g Box)',
        description: 'Hyderabad’s world-famous crunchy biscuit sticks roasted with slivered California almonds and cardamom.',
        price: 295,
        type: 'veg',
        category: 'Signature Bisticks',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
        rating: 4.9,
        votes: 8100,
        isBestseller: true,
        isDuetFavorite: true,
        prepTimeMinutes: 5
      },
      {
        id: 'ah-2',
        name: 'Hot Desi Ghee Bellam Jalebi (200g)',
        description: 'Crisp hot spiraled jalebis soaked in organic sugarcane jaggery syrup with saffron strands.',
        price: 180,
        type: 'veg',
        category: 'Pure Ghee Sweets',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        votes: 4500,
        isBestseller: true,
        prepTimeMinutes: 10
      }
    ]
  }
];

export const FRESH_PRODUCTS_DATA: FreshProduct[] = [
  {
    id: 'fp-1',
    name: 'Pure Cold-Pressed Valencia Orange Juice',
    category: 'Fresh Juices',
    tagline: '100% Raw, Zero Added Sugar, Cold-Pressed Daily at 6 AM',
    price: 129,
    originalPrice: 159,
    quantity: '350 ml bottle',
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'SunFresh Orchard Press Hyderabad',
      location: 'Shamshabad Organic Hub',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Pressed within 6 hours of delivery. Never pasteurized.',
    harvestOrPressTime: 'Today, 06:15 AM batch',
    shelfLife: '48 hours (keep chilled at 4°C)',
    benefits: ['100% Daily Vitamin C', 'Natural Electrolytes', 'Immunity Booster', 'Skin Glow'],
    nutrition: {
      calories: '128 kcal',
      protein: '2.1 g',
      carbs: '28 g',
      fat: '0.2 g',
      fiber: '2.4 g'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'fp-2',
    name: 'Vedic Green Wheatgrass & Amla Elixir',
    category: 'Herbal Juices',
    tagline: 'Potent Alkalizing Green Shot for Gut Detox & Energy',
    price: 149,
    originalPrice: 179,
    quantity: '250 ml glass bottle',
    rating: 4.8,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'Prakriti Herbs & Wellness',
      location: 'Medchal Agro Farm',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Hydroponic green wheatgrass extracted cold with fresh wild amla.',
    harvestOrPressTime: 'Today, 07:00 AM batch',
    shelfLife: '36 hours',
    benefits: ['Liver Detoxification', 'Chlorophyll Rich', 'Metabolism Enhancer', 'Anti-Inflammatory'],
    nutrition: {
      calories: '45 kcal',
      protein: '3.2 g',
      carbs: '8 g',
      fat: '0 g',
      fiber: '1.8 g'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'fp-3',
    name: 'Hyd-Pancharatna 5-Pulse Mixed Sprouts',
    category: 'Sprouts',
    tagline: 'Living Sprouts: Moong, Kala Chana, Fenugreek, Alfalfa & Moth',
    price: 89,
    originalPrice: 110,
    quantity: '250 g eco-pack',
    rating: 4.9,
    reviewsCount: 2310,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'Telangana Bio-Sprouts Collective',
      location: 'Kompally Organic Greenhouses',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Activated micro-roots harvested fresh this morning.',
    harvestOrPressTime: 'Harvested 5 hours ago',
    shelfLife: '4 days refrigerated',
    benefits: ['16g Plant Protein', 'Bioavailable Enzymes', 'Zero Cholesterol', 'Digestive Health'],
    nutrition: {
      calories: '160 kcal',
      protein: '16.4 g',
      carbs: '22 g',
      fat: '1.1 g',
      fiber: '7.8 g'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'fp-4',
    name: 'Roasted 4-Seed Superfood Crunch',
    category: 'Seeds',
    tagline: 'Himalayan Pink Salt Toasted Pumpkin, Chia, Flax & Sunflower Seeds',
    price: 199,
    originalPrice: 249,
    quantity: '200 g jar',
    rating: 4.8,
    reviewsCount: 1150,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'Naturale Superfoods India',
      location: 'Jubilee Hills Artisans',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Slow-batch roasted with zero artificial preservatives.',
    harvestOrPressTime: 'Fresh roasted this week',
    shelfLife: '60 days',
    benefits: ['Omega-3 Fatty Acids', 'Zinc & Magnesium Rich', 'High Dietary Fiber', 'Keto Friendly'],
    nutrition: {
      calories: '210 kcal per 40g',
      protein: '9.2 g',
      carbs: '6.4 g',
      fat: '15 g',
      fiber: '5.2 g'
    },
    inStock: true,
    isBestseller: false
  },
  {
    id: 'fp-5',
    name: 'Raw A2 Gir Cow Vedic Bilona Ghee',
    category: 'Homemade Products',
    tagline: 'Hand-Churned in Earthen Pots from Cultured Curd',
    price: 799,
    originalPrice: 899,
    quantity: '500 ml glass jar',
    rating: 5.0,
    reviewsCount: 940,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'GauKripa Vedic Dairy Sanctuary',
      location: 'Yadadri Grasslands, Telangana',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Traditional wooden bilona churning. 100% additive free.',
    harvestOrPressTime: 'Batched yesterday',
    shelfLife: '9 months',
    benefits: ['Pure A2 Beta-Casein', 'Aromatic Danedar Grain', 'Butyric Acid for Gut', 'Brain Fuel'],
    nutrition: {
      calories: '130 kcal per tbsp',
      protein: '0 g',
      carbs: '0 g',
      fat: '14.5 g',
      fiber: '0 g'
    },
    inStock: true,
    isBestseller: true
  },
  {
    id: 'fp-6',
    name: 'Spiced Pomegranate & Beetroot Cold-Pressed Sparkler',
    category: 'Fresh Juices',
    tagline: 'Ruby Red Antioxidant Bomb with Black Salt & Mint',
    price: 139,
    originalPrice: 169,
    quantity: '350 ml bottle',
    rating: 4.8,
    reviewsCount: 760,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'SunFresh Orchard Press Hyderabad',
      location: 'Shamshabad Organic Hub',
      certifiedOrganic: true
    },
    freshnessGuarantee: 'Cold-pressed under 15°C to preserve natural live polyphenols.',
    harvestOrPressTime: 'Today, 06:45 AM batch',
    shelfLife: '48 hours chilled',
    benefits: ['Natural Nitric Oxide for Endurance', 'Blood Purifier', 'Iron Absorption', 'Electrolyte Balance'],
    nutrition: {
      calories: '115 kcal',
      protein: '1.8 g',
      carbs: '26 g',
      fat: '0.1 g',
      fiber: '2.1 g'
    },
    inStock: true,
    isBestseller: false
  }
];

export const CUISINES_LIST = [
  { name: 'Biryani', icon: '🍲', count: 48, description: 'Charcoal Dum & Nizami flavours' },
  { name: 'Pizza', icon: '🍕', count: 32, description: 'Wood-fired & Neapolitan sourdough' },
  { name: 'Burgers', icon: '🍔', count: 26, description: 'Smashed patties & loaded brioche' },
  { name: 'South Indian', icon: '🥞', count: 42, description: 'Crispy dosas & Guntur idlis' },
  { name: 'North Indian', icon: '🥘', count: 39, description: 'Rich gravies & tandoor breads' },
  { name: 'Chinese', icon: '🥢', count: 28, description: 'Wok tossed noodles & momos' },
  { name: 'Desserts', icon: '🍰', count: 35, description: 'Tiramisu, waffles & royal sweets' },
  { name: 'Beverages', icon: '🥤', count: 40, description: 'Thickshakes, iced coffees & coolers' },
  { name: 'Snacks', icon: '🍟', count: 29, description: 'Chaat, fries & quick bites' }
];

export const STUDENT_PERKS = [
  {
    title: 'Flat 15% Student Discount',
    desc: 'Instant verification with any valid Hyderabad college ID (.edu or college card).',
    code: 'STUDENT15',
    icon: 'GraduationCap'
  },
  {
    title: 'Hostel Duet Combos',
    desc: 'Pair two different food cravings on late night study sessions with a single delivery charge.',
    code: 'NIGHTDUET',
    icon: 'Moon'
  },
  {
    title: 'Split Order / Group Cart',
    desc: 'One person pays or split directly between roommates with zero hassle.',
    code: 'HOSTELGANG',
    icon: 'Users'
  },
  {
    title: 'Zero Delivery On Orders > ₹299',
    desc: 'Special campus corridor delivery pricing for IIIT, UoH, BITS & Mahindra University.',
    code: 'CAMPUSFREE',
    icon: 'Bike'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Ananya Reddy',
    college: 'IIIT Hyderabad, Gachibowli',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    review: 'Ordering from GoDuet changed our hostel weekends completely! My roommate wanted Bawarchi Dum Biryani and I was desperately craving a Belgian Dark Chocolate Waffle. Both showed up hot and fresh in ONE bag by the same delivery partner. Brilliant concept!',
    rating: 5,
    tag: 'Verified Student Order',
    duet: 'Bawarchi + Belgian Waffle Co.'
  },
  {
    name: 'Vikramaditya Rao',
    college: 'Fintech Product Lead, Hitec City',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    review: 'Previously, my wife and I had to place two separate orders on Swiggy or Zomato with two separate delivery fees, two tips, and two riders arriving 25 minutes apart. GoDuet solved this seamlessly. The food sync is remarkably accurate.',
    rating: 5,
    tag: 'Verified Hyderabad Resident',
    duet: 'Little Italy + Conçù Patisserie'
  },
  {
    name: 'Sravani K.',
    college: 'Osmania University Scholar',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    review: 'The GoDuet Fresh vertical is also top-tier! The cold-pressed Valencia orange juice and 5-pulse sprouts arrived fresh at 7:30 AM before my morning gym session. True farm-to-table quality in Hyderabad.',
    rating: 5,
    tag: 'GoDuet Fresh Regular',
    duet: 'PureCold Juices + Bio-Sprouts'
  }
];

export const FAQS = [
  {
    q: 'How does GoDuet deliver from two different restaurants in one single delivery?',
    a: 'GoDuet has an intelligent route-syncing and prep-matching algorithm. When you select your first restaurant, we immediately curate compatible nearby restaurants whose kitchen preparation windows and geographical locations align perfectly. Our rider is assigned with a specialized dual-compartment thermal bag that keeps hot food piping hot (65°C+) and cold beverages/desserts chilled (4°C) throughout the journey.'
  },
  {
    q: 'What happens if Restaurant A prepares food faster than Restaurant B?',
    a: 'Our kitchen coordination system sends preparation triggers dynamically. The restaurant with a longer cook-time receives the order trigger first, while the quicker kitchen receives it with calculated delay. The rider arrives at Restaurant 1 just as it is packed, swings by Restaurant 2 within a 3-5 minute transit buffer, and proceeds directly to you.'
  },
  {
    q: 'Is there an extra delivery charge for two restaurants?',
    a: 'No! Unlike placing two separate orders on other apps (which costs you ₹80-₹120 in double delivery fees and double platform fees), GoDuet charges only ONE optimized single delivery fee (standard ₹35 to ₹45, or free with eligible coupons/student pass). You save significant money on every duet order.'
  },
  {
    q: 'Can I also order from GoDuet Fresh alongside my restaurant meal?',
    a: 'Yes, if your delivery address falls within the morning or afternoon fresh-dispatch route, you can seamlessly combine GoDuet Fresh juices and organic sprouts with your food order.'
  },
  {
    q: 'How do students get the 15% discount and perks?',
    a: 'Simply enter your college email ID (.ac.in or .edu) or upload your student ID photo on the Student Hub page. Once approved, the STUDENT15 code is automatically applied at checkout with zero delivery fee on orders above ₹299.'
  }
];
