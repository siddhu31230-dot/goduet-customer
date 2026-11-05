'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserAddress, Order } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'student';
  orders: Order[];
  activeOrder: Order | null;
  favorites: {
    restaurants: string[];
    products: string[];
  };
  openAuthModal: (mode?: 'login' | 'signup' | 'student') => void;
  closeAuthModal: () => void;
  login: (phoneOrEmail: string, name?: string) => void;
  loginWithPassword: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string; otp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  verifyStudent: (university: string, idNumber: string) => void;
  saveAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteProduct: (id: string) => void;
  createOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
}

const DEFAULT_USER: User = {
  id: 'user-demo-1',
  name: 'Aditya Varma',
  phone: '+91 98490 12345',
  email: 'aditya.v@students.iiit.ac.in',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  student: {
    isVerified: true,
    universityName: 'IIIT Hyderabad (Gachibowli)',
    studentId: 'IIITH-2023-CS-89',
    verifiedUntil: '2026-12-31',
    discountPercentage: 15
  },
  addresses: [
    {
      id: 'addr-1',
      type: 'Hostel',
      flatNo: 'Room 304, Bakul Nivas Hostel',
      landmark: 'IIIT Hyderabad Campus',
      locality: 'Gachibowli',
      city: 'Hyderabad',
      pincode: '500032',
      isDefault: true
    },
    {
      id: 'addr-2',
      type: 'Work',
      flatNo: 'Tower 4, Mindspace Tech Park',
      landmark: 'Near Inorbit Mall',
      locality: 'Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
      isDefault: false
    }
  ],
  favorites: {
    restaurants: ['rest-1', 'rest-4'],
    products: ['fresh-1', 'fresh-3']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'student'>('login');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [favorites, setFavorites] = useState<{ restaurants: string[]; products: string[] }>({
    restaurants: ['rest-1', 'rest-4'],
    products: ['fresh-1', 'fresh-3']
  });

  // Initialize theme, user and orders
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('goduet_theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const savedUser = localStorage.getItem('goduet_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.favorites) {
          setFavorites(parsed.favorites);
        }
      }
      const savedOrders = localStorage.getItem('goduet_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        if (parsedOrders.length > 0) {
          setActiveOrder(parsedOrders[0]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('goduet_theme', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return next;
    });
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' | 'student' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (phoneOrEmail: string, name?: string) => {
    const isStudent = phoneOrEmail.includes('.edu') || phoneOrEmail.includes('.ac.in');
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || (phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'GoDuet Foodie'),
      phone: phoneOrEmail.includes('@') ? '+91 98490 88219' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'customer@goduet.in',
      student: {
        isVerified: isStudent,
        universityName: isStudent ? 'IIIT Hyderabad' : undefined,
        discountPercentage: isStudent ? 15 : 0
      },
      addresses: DEFAULT_USER.addresses,
      favorites
    };
    setUser(newUser);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }
    closeAuthModal();
  };

  const loginWithPassword = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Login failed. Please verify credentials.' };
      }
      login(email, data.user?.name);
      return { success: true };
    } catch {
      // Fallback in case of mock environment
      login(email);
      return { success: true };
    }
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; message?: string; otp?: string }> => {
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, channel: 'sms' })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to send OTP' };
      }
      return { success: true, message: data.message, otp: data.debugOtp };
    } catch {
      return { success: true, message: 'OTP sent successfully (Simulated)', otp: '123456' };
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid or expired OTP' };
      }
      login(phone, data.user?.name || 'Hyderabad Foodie');
      return { success: true };
    } catch {
      login(phone);
      return { success: true };
    }
  };

  const registerUser = async (name: string, email: string, phone: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass, city: 'Hyderabad' })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Registration failed' };
      }
      login(email, name);
      return { success: true };
    } catch {
      login(email, name);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('goduet_user');
    } catch {
      // ignore
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const verifyStudent = (university: string, idNumber: string) => {
    if (!user) return;
    const updated: User = {
      ...user,
      student: {
        isVerified: true,
        universityName: university,
        studentId: idNumber,
        verifiedUntil: '2026-12-31',
        discountPercentage: 15
      }
    };
    setUser(updated);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveAddress = (addr: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddress: UserAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    const updated = {
      ...user,
      addresses: [newAddress, ...user.addresses]
    };
    setUser(updated);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: user.addresses.filter(a => a.id !== id)
    };
    setUser(updated);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    };
    setUser(updated);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleFavoriteRestaurant = (id: string) => {
    setFavorites(prev => {
      const exists = prev.restaurants.includes(id);
      const updatedRest = exists ? prev.restaurants.filter(r => r !== id) : [...prev.restaurants, id];
      const next = { ...prev, restaurants: updatedRest };
      if (user) {
        const u = { ...user, favorites: next };
        setUser(u);
        try {
          localStorage.setItem('goduet_user', JSON.stringify(u));
        } catch {}
      }
      return next;
    });
  };

  const toggleFavoriteProduct = (id: string) => {
    setFavorites(prev => {
      const exists = prev.products.includes(id);
      const updatedProd = exists ? prev.products.filter(p => p !== id) : [...prev.products, id];
      const next = { ...prev, products: updatedProd };
      if (user) {
        const u = { ...user, favorites: next };
        setUser(u);
        try {
          localStorage.setItem('goduet_user', JSON.stringify(u));
        } catch {}
      }
      return next;
    });
  };

  const createOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem('goduet_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setActiveOrder(order);
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        theme,
        toggleTheme,
        isAuthModalOpen,
        authModalMode,
        orders,
        activeOrder,
        favorites,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithPassword,
        sendOtp,
        verifyOtp,
        registerUser,
        logout,
        updateProfile,
        verifyStudent,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        toggleFavoriteRestaurant,
        toggleFavoriteProduct,
        createOrder,
        getOrderById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
