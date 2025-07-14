import React from 'react';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, Users, DollarSign } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => {
  const Icon = icon;
  return (
    <div className="admin-card p-6 rounded-xl">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ stats }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <StatCard 
        icon={Menu}
        label="Total Menu"
        value={stats.totalItems}
        color="blue"
      />
      <StatCard 
        icon={ShoppingBag}
        label="Item Tersedia"
        value={stats.readyItems}
        color="green"
      />
      <StatCard 
        icon={Users}
        label="Total Pesanan"
        value={stats.totalOrders}
        color="purple"
      />
      <StatCard 
        icon={DollarSign}
        label="Total Pendapatan"
        value={`Rp ${stats.totalRevenue.toLocaleString()}`}
        color="yellow"
      />
    </motion.div>
  );
};

export default StatsCards;