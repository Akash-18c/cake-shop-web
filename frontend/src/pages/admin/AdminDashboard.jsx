import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShoppingBag, FiTrendingUp, FiClock, FiPackage,
  FiArrowRight, FiPlus, FiMessageSquare, FiMail, FiPhone,
} from 'react-icons/fi';
import API from '../../utils/api';

const BASE_URL = 'http://localhost:5000';

const STATUS_STYLE = {
  Pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-red-600 border border-red-200',
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats]           = useState({ cakes: 0, orders: 0, pending: 0, revenue: 0, unread: 0 });
  const [recentOrders, setRecentOrders]   = useState([]);
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/cakes'),
      API.get('/orders'),
      API.get('/messages'),
    ]).then(([cr, or, mr]) => {
      const orders   = or.data;
      const cakes    = cr.data;
      const messages = mr.data;
      setStats({
        cakes:   cakes.length,
        orders:  orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.totalPrice || 0), 0),
        unread:  messages.filter(m => !m.read).length,
      });
      setRecentOrders(orders.slice(0, 6));
      setFeaturedCakes(cakes.filter(c => c.isFeatured).slice(0, 4));
      setRecentMessages(messages.slice(0, 4));
    }).catch(() => {});
  }, []);

  const statCards = [
    { icon: <FiPackage size={20} />,       label: 'Total Cakes',  value: stats.cakes,                        color: 'from-orange-400 to-amber-500',   link: '/admin/cakes'    },
    { icon: <FiShoppingBag size={20} />,   label: 'Total Orders', value: stats.orders,                       color: 'from-violet-500 to-purple-600',  link: '/admin/orders'   },
    { icon: <FiClock size={20} />,         label: 'Pending',      value: stats.pending,                      color: 'from-amber-400 to-orange-500',   link: '/admin/orders'   },
    { icon: <FiTrendingUp size={20} />,    label: 'Revenue',      value: `₹${stats.revenue.toLocaleString()}`, color: 'from-emerald-400 to-teal-500', link: '/admin/orders'   },
    { icon: <FiMessageSquare size={20} />, label: 'New Messages', value: stats.unread,                       color: 'from-pink-400 to-rose-500',      link: '/admin/messages', badge: stats.unread > 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-hero-gradient p-6 md:p-8">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #e8a03c 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1">Welcome back 👋</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">The Cake Point Dashboard</h2>
            <p className="text-white/40 text-sm mt-1">Manage your bakery from one place</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/admin/add-cake"
              className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all">
              <FiPlus size={15} /> Add Cake
            </Link>
            <Link to="/admin/messages"
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all backdrop-blur-sm border border-white/10">
              <FiMessageSquare size={15} /> Messages
              {stats.unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] font-bold bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {stats.unread}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <Link to={s.link}
              className="relative block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 group">
              {s.badge && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              )}
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-dark">{s.value}</p>
              <p className="text-xs text-muted font-medium mt-0.5">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main grid — orders + cakes */}
      <div className="grid xl:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-display font-bold text-lg text-dark">Recent Orders</h3>
            <Link to="/admin/orders"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all">
              View all <FiArrowRight size={11} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <FiShoppingBag size={36} className="mx-auto mb-3" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order, i) => (
                <motion.div key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                    {order.customerName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted truncate mt-0.5">{order.cake}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className={`status-pill ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                    {order.totalPrice > 0 && <p className="text-xs text-muted">₹{order.totalPrice}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Cakes */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-display font-bold text-lg text-dark">Featured Cakes</h3>
            <Link to="/admin/cakes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all">
              Manage <FiArrowRight size={11} />
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {featuredCakes.map((cake, i) => {
              const imgSrc = cake.image?.startsWith('/uploads') ? BASE_URL + cake.image : cake.image;
              return (
                <motion.div key={cake._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/60 transition-colors group">
                  <img src={imgSrc} alt={cake.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark text-sm truncate">{cake.name}</p>
                    <p className="text-xs text-muted">{cake.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-brand-600">₹{cake.isOffer && cake.offerPrice ? cake.offerPrice : cake.price}</p>
                    {cake.isOffer && <p className="text-xs text-gray-300 line-through">₹{cake.price}</p>}
                  </div>
                </motion.div>
              );
            })}
            <Link to="/admin/add-cake"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-brand-200 text-brand-500 hover:border-brand-400 hover:bg-brand-50 transition-all text-sm font-semibold mt-1">
              <FiPlus size={15} /> Add New Cake
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-lg text-dark">Recent Messages</h3>
            {stats.unread > 0 && (
              <span className="text-[11px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                {stats.unread} unread
              </span>
            )}
          </div>
          <Link to="/admin/messages"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-all">
            View all <FiArrowRight size={11} />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-14 text-gray-300">
            <FiMessageSquare size={32} className="mx-auto mb-3" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Messages from your contact form will appear here</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-50">
            {recentMessages.map((msg, i) => (
              <motion.div key={msg._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative p-5 hover:bg-gray-50/60 transition-colors group">

                {/* Unread dot */}
                {!msg.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500" />
                )}

                {/* Avatar + name */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    msg.read ? 'bg-gray-100 text-gray-500' : 'bg-brand-100 text-brand-700'
                  }`}>
                    {msg.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-dark text-sm truncate">{msg.name}</p>
                    <p className="text-[10px] text-muted">{timeAgo(msg.createdAt)}</p>
                  </div>
                </div>

                {/* Message preview */}
                <p className="text-xs text-dark/70 leading-relaxed line-clamp-2 mb-3">
                  {msg.message}
                </p>

                {/* Contact chips */}
                <div className="flex flex-col gap-1">
                  {msg.email && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-muted truncate">
                      <FiMail size={9} className="text-brand-400 flex-shrink-0" /> {msg.email}
                    </span>
                  )}
                  {msg.phone && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-muted">
                      <FiPhone size={9} className="text-brand-400 flex-shrink-0" /> {msg.phone}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
