import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Ambil data menu dari Supabase saat pertama kali load
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from('menuitem')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Gagal fetch menu dari Supabase:", error.message);
      } else {
        setMenuItems(data);
      }
    };

    fetchMenuItems();
  }, []);

  // Cart (masih lokal)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Orders (masih lokal)
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Failed to load orders", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const value = {
    menuItems,
    setMenuItems,
    cart,
    setCart,
    orders,
    setOrders
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
