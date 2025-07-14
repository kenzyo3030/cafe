import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/context/AppContext';

const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  updateNotes, 
  removeItem, 
  totalPrice 
}) => {
  const { setOrders, setCart } = useContext(AppContext);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: ''
  });
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.address) {
      toast({
        title: "Informasi belum lengkap!",
        description: "Mohon isi nama dan alamat/meja",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong!",
        description: "Tambahkan item ke keranjang terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    // Generate WhatsApp message
    let message = `*PESANAN BARU*\n\n`;
    message += `Pemesan: ${customerInfo.name}\n`;
    message += `Alamat/Meja: ${customerInfo.address}\n\n`;
    message += `*Pesanan:*\n`;
    
    cart.forEach(item => {
      message += `• ${item.name}`;
      if (item.notes) {
        message += ` (${item.notes})`;
      }
      message += ` x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Total: Rp ${totalPrice.toLocaleString()}*`;

    // Save order
    const order = {
      id: Date.now(),
      customerName: customerInfo.name,
      address: customerInfo.address,
      items: cart,
      total: totalPrice,
      date: new Date().toLocaleString('id-ID')
    };

    setOrders(prevOrders => [...prevOrders, order]);

    // Open WhatsApp
    const phoneNumber = '6282121989177'; // Ganti dengan nomor WhatsApp Anda
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Pesanan berhasil dikirim!",
      description: "Anda akan diarahkan ke WhatsApp",
    });

    // Clear cart and close modal
    setCart([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Keranjang Belanja</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-6">
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="cart-item p-4 rounded-lg"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Rp {item.price.toLocaleString()}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            className="ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Notes */}
                        <div className="mt-2">
                          <Input
                            placeholder="Catatan khusus (opsional)"
                            value={item.notes || ''}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Customer Info */}
            {cart.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-bold">Informasi Pemesan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Pemesan</label>
                    <Input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alamat/Nomor Meja</label>
                    <Input
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="Alamat atau nomor meja"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold gradient-text">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
              <Button 
                onClick={handleCheckout}
                className="whatsapp-btn w-full text-white gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Checkout via WhatsApp
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CartModal;