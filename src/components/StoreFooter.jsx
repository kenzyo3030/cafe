import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const StoreFooter = () => {
  return (
    <footer className="bg-white/10 text-white mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Jl. Makanan Enak No. 123, Jakarta</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Buka Setiap Hari: 10:00 - 22:00</span>
          </div>
        </div>
        <p className="text-sm mt-4 opacity-70">&copy; {new Date().getFullYear()} Kedai Makanan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default StoreFooter;