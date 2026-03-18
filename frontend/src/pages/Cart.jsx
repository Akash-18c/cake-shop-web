import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const BASE_URL = 'http://localhost:5000';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-24 h-24 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart size={36} className="text-brand-300" />
          </div>
          <h2 className="font-display text-2xl font-bold text-dark mb-2">Your cart is empty</h2>
          <p className="text-muted mb-8">Add some delicious cakes to get started!</p>
          <Link to="/cakes" className="btn-primary">
            Browse Cakes <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark">Your Cart</h1>
          <p className="text-muted text-sm mt-1">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map(item => {
                const imgSrc = item.image?.startsWith('/uploads') ? BASE_URL + item.image : item.image;
                const price  = item.isOffer && item.offerPrice ? item.offerPrice : item.price;
                return (
                  <motion.div key={item._id} layout
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:border-brand-100 hover:shadow-warm transition-all duration-300">
                    <img src={imgSrc} alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'; }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-dark truncate text-sm sm:text-base">{item.name}</h3>
                      <p className="text-brand-600 font-bold text-sm mt-0.5">₹{price}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => updateQty(item._id, item.qty - 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <FiMinus size={12} />
                        </button>
                        <span className="font-bold text-dark w-6 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-brand-100 flex items-center justify-center transition-colors">
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button onClick={() => removeFromCart(item._id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <FiTrash2 size={15} />
                      </button>
                      <span className="font-bold text-dark text-sm">₹{price * item.qty}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-display font-bold text-lg text-dark mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => {
                  const price = item.isOffer && item.offerPrice ? item.offerPrice : item.price;
                  return (
                    <div key={item._id} className="flex justify-between text-sm text-muted">
                      <span className="truncate mr-2">{item.name} × {item.qty}</span>
                      <span className="flex-shrink-0">₹{price * item.qty}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-dark mb-5">
                <span>Total</span>
                <span className="text-brand-600 text-lg">₹{total}</span>
              </div>
              <Link to="/order" className="btn-primary w-full mb-3">
                Proceed to Order <FiArrowRight />
              </Link>
              <button onClick={clearCart}
                className="w-full text-center text-xs text-muted hover:text-red-500 transition-colors py-2">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
