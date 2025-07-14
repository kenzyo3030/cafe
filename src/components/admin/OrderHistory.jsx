import React from 'react';
import { ShoppingBag } from 'lucide-react';

const OrderHistory = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Belum ada pesanan masuk</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Riwayat Pesanan</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="order-card p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold">{order.customerName}</h3>
                <p className="text-sm text-gray-600">{order.address}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Rp {order.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{order.items.length} item</p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;