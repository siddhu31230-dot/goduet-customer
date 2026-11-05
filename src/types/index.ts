export type FoodType = 'veg' | 'non-veg' | 'egg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: FoodType;
  category: string;
  image: string;
  rating: number;
  votes: number;
  isBestseller?: boolean;
  isDuetFavorite?: boolean;
  spicyLevel?: 1 | 2 | 3;
  prepTimeMinutes: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMins: number;
  distanceKm: number;
  costForTwo: number;
  locality: string;
  address: string;
  image: string;
  bannerImage: string;
  isDuetEligible: boolean;
  duetPartners: string[]; // IDs of compatible paired restaurants
  duetSpeciality?: string;
  featuredOffer?: string;
  isPureVeg?: boolean;
  menuCategories: string[];
  menu: MenuItem[];
}

export interface FreshProduct {
  id: string;
  name: string;
  category: 'Fresh Juices' | 'Herbal Juices' | 'Sprouts' | 'Seeds' | 'Healthy Snacks' | 'Homemade Products';
  tagline: string;
  price: number;
  originalPrice?: number;
  quantity: string;
  rating: number;
  reviewsCount: number;
  image: string;
  seller: {
    name: string;
    location: string;
    certifiedOrganic: boolean;
  };
  freshnessGuarantee: string;
  harvestOrPressTime: string;
  shelfLife: string;
  benefits: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat?: string;
    fiber?: string;
  };
  inStock: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  type: FoodType;
  restaurantId?: string;
  restaurantName?: string;
  isFreshItem?: boolean;
  freshProductId?: string;
  image?: string;
  specialInstructions?: string;
}

export interface HyderabadLocation {
  id: string;
  name: string;
  area: string;
  pincode: string;
  isPopular: boolean;
  zone: 'West Hyderabad' | 'Central Hyderabad' | 'North Hyderabad' | 'Cyberabad';
}

export interface StudentProfile {
  isVerified: boolean;
  universityName?: string;
  studentId?: string;
  verifiedUntil?: string;
  discountPercentage: number;
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Hostel' | 'Other';
  flatNo: string;
  landmark: string;
  locality: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  student: StudentProfile;
  addresses: UserAddress[];
  favorites?: {
    restaurants: string[];
    products: string[];
  };
  savedPaymentMethod?: string;
}

export interface OrderTimelineStep {
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'completed' | 'current' | 'upcoming';
  restaurantSlot?: 'A' | 'B' | 'Both';
}

export interface Order {
  id: string;
  createdAt: string;
  deliveryEtaMinutes: number;
  deliveryEtaTime: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'rider_assigned' | 'picking_up' | 'on_the_way' | 'delivered';
  isDuetOrder: boolean;
  restaurantA?: {
    id: string;
    name: string;
    locality: string;
    prepStatus: 'received' | 'in_kitchen' | 'packed' | 'picked';
  };
  restaurantB?: {
    id: string;
    name: string;
    locality: string;
    prepStatus: 'received' | 'in_kitchen' | 'packed' | 'picked';
  };
  items: CartItem[];
  deliveryAddress: UserAddress;
  deliveryRider?: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
    hasDualThermalBag: boolean;
  };
  bill: {
    subtotalA: number;
    subtotalB: number;
    freshSubtotal: number;
    foodSubtotal: number;
    singleCoordinatedDeliveryFee: number;
    traditionalSplitDeliveryFee: number;
    savingsOnDelivery: number;
    packagingFee: number;
    platformFee: number;
    gstAndRestaurantCharges: number;
    couponDiscount: number;
    tip: number;
    finalTotal: number;
    couponApplied?: string;
  };
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Netbanking' | 'Cash on Delivery';
  paymentStatus: 'paid' | 'pending';
  timeline: OrderTimelineStep[];
}
