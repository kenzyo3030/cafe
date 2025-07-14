import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CartModal from '@/components/CartModal';
import { AppContext } from '@/context/AppContext';
import StoreHeader from '@/components/StoreHeader';
import StoreFooter from '@/components/StoreFooter';

const CustomerMenu = () => {
  const { menuItems, cart, setCart } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const categories = ['Semua', 'Makanan', 'Minuman'];

  const filteredItems =
    selectedCategory === 'Semua'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = item => {
    if (item.status === 'sold-out') {
      toast({
        title: 'Maaf!',
        description: 'Item ini sedang habis',
        variant: 'destructive',
      });
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, notes: '' }]);
    }

    toast({
      title: 'Ditambahkan ke keranjang!',
      description: `${item.name} berhasil ditambahkan`,
    });
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(
        cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const updateCartNotes = (id, notes) => {
    setCart(cart.map(item => (item.id === id ? { ...item, notes } : item)));
  };

  const removeFromCart = id => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Helmet>
        <title>Menu Digital - Kedai Makanan</title>
        <meta
          name="description"
          content="Menu digital interaktif untuk kedai makanan dengan sistem pemesanan WhatsApp"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <StoreHeader />

        <main className="flex-grow">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto px-4 my-6"
          >
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-tab px-4 py-2 rounded-full whitespace-nowrap font-medium ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Menu Grid */}
          <div className="max-w-6xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="food-card rounded-xl overflow-hidden bg-white shadow-md"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'ready'
                            ? 'status-ready'
                            : 'status-sold-out'
                        }`}
                      >
                        {item.status === 'ready' ? 'Tersedia' : 'Habis'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold gradient-text">
                          Rp {item.price.toLocaleString()}
                        </span>
                        <Button
                          onClick={() => addToCart(item)}
                          disabled={item.status === 'sold-out'}
                          className="gap-2"
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <StoreFooter />

        {/* Floating Cart Button */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="floating-cart text-white p-4 flex items-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm font-medium">
                  {getTotalItems()} Item
                </div>
                <div className="text-xs">
                  Rp {getTotalPrice().toLocaleString()}
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cart Modal */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateCartQuantity}
          updateNotes={updateCartNotes}
          removeItem={removeFromCart}
          totalPrice={getTotalPrice()}
        />
      </div>
    </>
  );
};

export default CustomerMenu;
