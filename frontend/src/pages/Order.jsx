import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Order() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({ customerName: '', phone: '', address: '', deliveryDate: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your cart is empty!');
    setLoading(true);
    try {
      const cakeNames = cart.map(i => `${i.name} x${i.qty}`).join(', ');
      await API.post('/orders', { ...form, cake: cakeNames, totalPrice: total });
      setSubmitted(true);
      clearCart();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to place order.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappOrder = () => {
    const cakeNames = cart.map(i => `${i.name} x${i.qty}`).join(', ');
    const msg = encodeURIComponent(
      `New Order - The Cake Point\n\nName: ${form.customerName}\nPhone: ${form.phone}\nAddress: ${form.address}\nCakes: ${cakeNames}\nDelivery: ${form.deliveryDate}\nMessage: ${form.message || 'None'}\nTotal: Rs.${total}`
    );
    window.open(`https://wa.me/919907737323?text=${msg}`, '_blank');
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={36} className="text-emerald-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-dark mb-3">Order Placed!</h2>
          <p className="text-muted mb-8 leading-relaxed">
            Thank you! We'll call you shortly to confirm your order.
          </p>
          <a href="/" className="btn-primary">Back to Home <FiArrowRight /></a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark">Place Your Order</h1>
          <p className="text-muted text-sm mt-1">Fill in your details and we'll deliver your cake!</p>
        </div>

        {/* Cart summary */}
        {cart.length > 0 && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-dark text-sm mb-3">Your Items</h3>
            <div className="space-y-1.5">
              {cart.map(i => {
                const price = i.isOffer && i.offerPrice ? i.offerPrice : i.price;
                return (
                  <div key={i._id} className="flex justify-between text-sm text-muted">
                    <span>{i.name} × {i.qty}</span>
                    <span className="font-semibold text-dark">₹{price * i.qty}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-brand-200 mt-3 pt-3 flex justify-between font-bold text-dark">
              <span>Total</span>
              <span className="text-brand-600">₹{total}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Full Name *</label>
              <input name="customerName" value={form.customerName} onChange={handleChange}
                required placeholder="Your name" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                required placeholder="+91 98765 43210" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Delivery Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange}
              required placeholder="Full delivery address" rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Delivery Date *</label>
            <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange}
              required min={new Date().toISOString().split('T')[0]} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Message on Cake</label>
            <input name="message" value={form.message} onChange={handleChange}
              placeholder="e.g. Happy Birthday Rahul!" className="input-field" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button type="button" onClick={whatsappOrder}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(37,211,102,0.3)]">
              <FaWhatsapp size={18} /> Order via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
