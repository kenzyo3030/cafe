import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MenuManagement = ({ items, onAddItem, onEditItem, onDeleteItem }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Kelola Menu</h2>
        <Button 
          onClick={onAddItem}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6 + index * 0.05, // stagger efek ringan
              ease: "easeOut"
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-40 object-cover object-center"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-base">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status === 'ready' ? 'Tersedia' : 'Habis'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{item.category}</p>
              <p className="text-lg font-bold text-blue-600 mb-3">
                Rp {item.price.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEditItem(item)}
                  className="flex-1 gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDeleteItem(item.id)}
                  className="flex-1 gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
