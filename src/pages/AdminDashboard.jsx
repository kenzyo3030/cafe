// ✅ AdminDashboard.jsx (Final, Revisi Lengkap Supabase Auth)

import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import MenuManagement from '@/components/admin/MenuManagement';
import OrderHistory from '@/components/admin/OrderHistory';
import MenuItemModal from '@/components/admin/MenuItemModal';
import { AppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const extractFileName = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1].split('?')[0];
};

const AdminDashboard = () => {
  const { menuItems, setMenuItems, orders } = useContext(AppContext);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['Makanan', 'Minuman'];
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    description: '',
    image: null,
    status: 'ready'
  });
  const [imagePreview, setImagePreview] = useState(null);

 useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin'); // redirect kalau belum login
    } else {
      fetchData(); // ambil data menu kalau sudah login
    }
  };
  checkSession();
}, [navigate]);


  const fetchData = async () => {
    const { data, error } = await supabase
      .from('menuitem')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) {
      setMenuItems(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminLoggedIn');
    toast({
      title: "Logout berhasil!",
      description: "Sampai jumpa lagi",
    });
    navigate('/admin');
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Makanan',
      price: '',
      description: '',
      image: null,
      status: 'ready'
    });
    setImagePreview(null);
  };

  const handleSaveItem = async () => {
    if (!formData.name || !formData.price || (!formData.image && !editingItem)) {
      toast({
        title: "Error!",
        description: "Nama, harga, dan gambar harus diisi",
        variant: "destructive"
      });
      return;
    }

    let imageUrl = formData.image;
    const isNewImage = formData.image instanceof File;

    if (isNewImage) {
      const fileExt = formData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      if (editingItem?.image) {
        const oldImageName = extractFileName(editingItem.image);
        if (oldImageName) {
          await supabase.storage.from('menu-images').remove([oldImageName]);
        }
      }

      const { error: uploadError } = await supabase
        .storage
        .from('menu-images')
        .upload(fileName, formData.image);

      if (uploadError) {
        toast({
          title: "Gagal upload gambar",
          description: uploadError.message,
          variant: "destructive"
        });
        return;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('menu-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const newItem = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      description: formData.description,
      image: imageUrl,
      status: formData.status
    };

    if (editingItem) {
      await supabase.from('menuitem').update(newItem).eq('id', editingItem.id);
      toast({ title: "Item diupdate", description: `${newItem.name} berhasil diperbarui` });
    } else {
      const { error } = await supabase.from('menuitem').insert(newItem);
      if (error) {
        toast({
          title: "Insert gagal",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      toast({ title: "Item ditambahkan", description: `${newItem.name} berhasil ditambahkan` });
    }

    await fetchData();
    setIsMenuModalOpen(false);
    resetForm();
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      status: item.status
    });
    setImagePreview(item.image);
    setIsMenuModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    if (itemToDelete?.image) {
      const imageName = extractFileName(itemToDelete.image);
      if (imageName) {
        await supabase.storage.from('menu-images').remove([imageName]);
      }
    }
    await supabase.from('menuitem').delete().eq('id', id);
    toast({
      title: "Item berhasil dihapus!",
      description: "Item dan gambar terkait telah dihapus.",
    });
    fetchData();
  };

  const stats = {
    totalItems: menuItems.length,
    readyItems: menuItems.filter(item => item.status === 'ready').length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Kedai Makanan</title>
        <meta name="description" content="Dashboard admin untuk mengelola menu dan pesanan kedai makanan" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <AdminHeader onLogout={handleLogout} />

        <div className="max-w-7xl mx-auto p-6">
          <StatsCards stats={stats} />

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="admin-card rounded-xl p-6"
          >
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('menu')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === 'menu' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Kelola Menu
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === 'orders' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Riwayat Pesanan
              </button>
            </div>

            {activeTab === 'menu' && (
              <MenuManagement 
                items={menuItems}
                onAddItem={() => {
                  resetForm();
                  setIsMenuModalOpen(true);
                }}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            )}

            {activeTab === 'orders' && <OrderHistory orders={orders} />}
          </motion.div>
        </div>

        {isMenuModalOpen && (
          <MenuItemModal
            isOpen={isMenuModalOpen}
            onClose={() => {
              setIsMenuModalOpen(false);
              resetForm();
            }}
            onSave={handleSaveItem}
            formData={formData}
            setFormData={setFormData}
            editingItem={editingItem}
            categories={categories}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
