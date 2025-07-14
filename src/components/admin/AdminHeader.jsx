import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="admin-sidebar p-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100">Kelola menu dan pesanan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-white border-white hover:bg-white hover:text-blue-600"
          >
            Lihat Menu
          </Button>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="text-white border-white hover:bg-white hover:text-blue-600 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;