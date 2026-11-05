'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAddress, Order } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'student';
  orders: Order[];
  activeOrder: Order | null;
  openAuthModal: (mode?: 'login' | 'signup' | 'student') => void;
  closeAuthModal: () => void;
  login: (phoneOrEmail: string, name?: string) => void;
  logout: () => void;
  verifyStudent: (university: string, idNumber: string) => void;
  saveAddress: (address: Omit<UserAddress, 'id'>) => void;
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
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'student'>('login');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Hydrate user and orders
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('goduet_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
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
      addresses: DEFAULT_USER.addresses
    };
    setUser(newUser);
    try {
      localStorage.setItem('goduet_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('goduet_user');
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
        isAuthModalOpen,
        authModalMode,
        orders,
        activeOrder,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        verifyStudent,
        saveAddress,
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
