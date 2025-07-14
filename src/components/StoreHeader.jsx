import React from 'react';
import { motion } from 'framer-motion'; // ✅ hanya 1x import motion
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

const StoreHeader = () => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-effect sticky top-0 z-40 p-4"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          <motion.img
            src="https://vtxqvbvpyfyissvtupuq.supabase.co/storage/v1/object/public/assets/cafe_13795952.png"
            alt="Store logo"
            className="h-16 w-16 rounded-full shadow-md"
            initial={{ rotate: -10, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          />
          <div>
            <h1 className="text-2xl font-bold gradient-text">Kedai Makanan</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Menu Digital Interaktif</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/qr">
            <Button variant="outline" size="sm" className="gap-2">
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code</span>
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </div>
        
      </div>
    </motion.header>
  );
};

export default StoreHeader;
