'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, FreshProduct, Restaurant } from '@/types';
import { RESTAURANTS_DATA } from '@/data/mockData';

interface BillSummary {
  subtotalA: number;
  subtotalB: number;
  freshSubtotal: number;
  foodSubtotal: number;
  singleDeliveryFee: number;
  traditionalTwoDeliveryFee: number;
  savingsOnDelivery: number;
  packagingFee: number;
  platformFee: number;
  gstAndCharges: number;
  couponDiscount: number;
  tip: number;
  finalTotal: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantA: Restaurant | null;
  restaurantB: Restaurant | null;
  isDuetOrder: boolean;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  tip: number;
  needCutlery: boolean;
  deliveryNotes: string;
  bill: BillSummary;
  addMenuItem: (item: MenuItem, restaurant: Restaurant) => { success: boolean; message?: string };
  addFreshItem: (product: FreshProduct, quantity?: number) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setTip: (amount: number) => void;
  setNeedCutlery: (val: boolean) => void;
  setDeliveryNotes: (notes: string) => void;
  canPairWith: (restaurantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('DUETFIRST');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [flatDiscount, setFlatDiscount] = useState<number>(100);
  const [tip, setTip] = useState<number>(30);
  const [needCutlery, setNeedCutlery] = useState<boolean>(true);
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // Hydrate cart from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('goduet_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('goduet_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Determine restaurants currently in cart
  const restaurantIds = Array.from(
    new Set(items.filter(i => !i.isFreshItem && i.restaurantId).map(i => i.restaurantId as string))
  );

  const restaurantA = restaurantIds[0] ? RESTAURANTS_DATA.find(r => r.id === restaurantIds[0]) || null : null;
  const restaurantB = restaurantIds[1] ? RESTAURANTS_DATA.find(r => r.id === restaurantIds[1]) || null : null;
  const isDuetOrder = Boolean(restaurantA && restaurantB);

  // Check if a new restaurant can be added to the duet
  const canPairWith = (candidateId: string): boolean => {
    if (restaurantIds.length === 0) return true;
    if (restaurantIds.includes(candidateId)) return true;
    if (restaurantIds.length >= 2) return false;
    
    // Check if candidate is eligible to pair with restaurantA
    if (restaurantA) {
      return restaurantA.duetPartners.includes(candidateId);
    }
    return true;
  };

  const addMenuItem = (item: MenuItem, restaurant: Restaurant): { success: boolean; message?: string } => {
    // If restaurant already in cart, allow
    if (restaurantIds.includes(restaurant.id)) {
      setItems(prev => {
        const existing = prev.find(i => i.menuItemId === item.id && i.restaurantId === restaurant.id);
        if (existing) {
          return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        const newItem: CartItem = {
          id: `${restaurant.id}_${item.id}_${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          type: item.type,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          image: item.image,
          isFreshItem: false
        };
        return [...prev, newItem];
      });
      return { success: true };
    }

    // If 0 restaurants so far, allow first
    if (restaurantIds.length === 0) {
      setItems(prev => {
        const newItem: CartItem = {
          id: `${restaurant.id}_${item.id}_${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          type: item.type,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          image: item.image,
          isFreshItem: false
        };
        return [...prev, newItem];
      });
      return { success: true };
    }

    // If 1 restaurant in cart, check Duet eligibility
    if (restaurantIds.length === 1) {
      if (restaurantA && !restaurantA.duetPartners.includes(restaurant.id)) {
        return {
          success: false,
          message: `GoDuet coordinates delivery only between geographically and kitchen-synchronized restaurants. "${restaurant.name}" cannot be paired with "${restaurantA.name}". Choose a verified Duet Partner instead!`
        };
      }

      setItems(prev => {
        const newItem: CartItem = {
          id: `${restaurant.id}_${item.id}_${Date.now()}`,
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          type: item.type,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          image: item.image,
          isFreshItem: false
        };
        return [...prev, newItem];
      });
      return { success: true, message: `Awesome! You unlocked a Duet Order with ${restaurantA?.name} + ${restaurant.name}!` };
    }

    // If already 2 restaurants
    return {
      success: false,
      message: 'GoDuet allows combining up to 2 distinct restaurants per coordinated delivery bag. To switch, please remove items from one restaurant first.'
    };
  };

  const addFreshItem = (product: FreshProduct, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.isFreshItem && i.freshProductId === product.id);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      const newItem: CartItem = {
        id: `fresh_${product.id}_${Date.now()}`,
        menuItemId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        type: 'veg',
        isFreshItem: true,
        freshProductId: product.id,
        image: product.image
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DUETFIRST') {
      setAppliedCoupon('DUETFIRST');
      setFlatDiscount(100);
      setCouponDiscountPercent(0);
      return { success: true, message: 'DUETFIRST applied! ₹100 saved on your order.' };
    }
    if (clean === 'STUDENT15' || clean === 'STUDENT50') {
      setAppliedCoupon(clean);
      setCouponDiscountPercent(15);
      setFlatDiscount(0);
      return { success: true, message: 'Student Pass unlocked! 15% discount applied.' };
    }
    if (clean === 'HYDDUET' || clean === 'FREEDEL') {
      setAppliedCoupon(clean);
      setFlatDiscount(45);
      setCouponDiscountPercent(0);
      return { success: true, message: `${clean} applied! Zero delivery charge.` };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try DUETFIRST or STUDENT15.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setFlatDiscount(0);
    setCouponDiscountPercent(0);
  };

  // Bill calculations
  const subtotalA = items
    .filter(i => !i.isFreshItem && i.restaurantId === restaurantA?.id)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const subtotalB = items
    .filter(i => !i.isFreshItem && i.restaurantId === restaurantB?.id)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const freshSubtotal = items
    .filter(i => i.isFreshItem)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  const foodSubtotal = subtotalA + subtotalB + freshSubtotal;

  // Transparent single vs dual delivery comparison
  const singleDeliveryFee = foodSubtotal > 600 || appliedCoupon === 'FREEDEL' || appliedCoupon === 'HYDDUET' ? 0 : 39;
  const traditionalTwoDeliveryFee = isDuetOrder ? 85 : 45;
  const savingsOnDelivery = isDuetOrder ? Math.max(0, traditionalTwoDeliveryFee - singleDeliveryFee) : 0;

  const packagingFee = (restaurantA ? 25 : 0) + (restaurantB ? 25 : 0) + (freshSubtotal > 0 ? 15 : 0);
  const platformFee = items.length > 0 ? 5 : 0;
  const gstAndCharges = Math.round(foodSubtotal * 0.05);

  let calculatedDiscount = 0;
  if (couponDiscountPercent > 0) {
    calculatedDiscount = Math.round((foodSubtotal * couponDiscountPercent) / 100);
  } else if (flatDiscount > 0 && foodSubtotal > 0) {
    calculatedDiscount = Math.min(foodSubtotal, flatDiscount);
  }

  const finalTotal = Math.max(0, foodSubtotal + singleDeliveryFee + packagingFee + platformFee + gstAndCharges + tip - calculatedDiscount);

  const bill: BillSummary = {
    subtotalA,
    subtotalB,
    freshSubtotal,
    foodSubtotal,
    singleDeliveryFee,
    traditionalTwoDeliveryFee,
    savingsOnDelivery,
    packagingFee,
    platformFee,
    gstAndCharges,
    couponDiscount: calculatedDiscount,
    tip,
    finalTotal
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantA,
        restaurantB,
        isDuetOrder,
        appliedCoupon,
        couponDiscountPercent,
        tip,
        needCutlery,
        deliveryNotes,
        bill,
        addMenuItem,
        addFreshItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setTip,
        setNeedCutlery,
        setDeliveryNotes,
        canPairWith
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
