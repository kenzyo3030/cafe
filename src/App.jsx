import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // ✅ Tambahkan ini
import { Toaster } from '@/components/ui/toaster';
import CustomerMenu from '@/pages/CustomerMenu';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import QRGenerator from '@/pages/QRGenerator';
import { AppProvider } from '@/context/AppContext';

function App() {
  return (
    <AppProvider>
      <HelmetProvider> {/* ✅ Bungkus semua dengan HelmetProvider */}
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<CustomerMenu />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/qr" element={<QRGenerator />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </HelmetProvider>
    </AppProvider>
  );
}

export default App;
