import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2, FiPhone, FiMapPin, FiCalendar, FiMessageSquare,
  FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle,
  FiCheck, FiRefreshCw
} from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';

/* ── Status configuration ── */
const S = {
  Pending: {
    label: 'Pending',
    icon: FiClock,
    colors: {
      badge:  'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
      bar:    'from-amber-400 to-orange-400',
      avatar: 'bg-amber-100 text-amber-800',
      box:    'bg-amber-50/50 border-amber-100',
      btn:    'bg-amber-500 hover:bg-amber-600 shadow-amber-200/60',
      dot:    'bg-amber-400',
      tab:    'text-amber-700 bg-amber-50 border-amber-200',
    },
  },
  Confirmed: {
    label: 'Confirmed',
    icon: FiCheck,
    colors: {
      badge:  'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100',
      bar:    'from-blue-400 to-blue-600',
      avatar: 'bg-blue-100 text-blue-800',
      box:    'bg-blue-50/50 border-blue-100',
      btn:    'bg-blue-600 hover:bg-blue-700 shadow-blue-200/60',
      dot:    'bg-blue-500',
      tab:    'text-blue-700 bg-blue-50 border-blue-200',
    },
  },
  Delivered: {
    label: 'Delivered',
    icon: FiCheckCircle,
    colors: {
      badge:  'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
      bar:    'from-emerald-400 to-teal-500',
      avatar: 'bg-emerald-100 text-emerald-800',
      box:    'bg-emerald-50/50 border-emerald-100',
      btn:    'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/60',
      dot:    'bg-emerald-500',
      tab:    'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  },
  Cancelled: {
    label: 'Cancelled',
    icon: FiXCircle,
    colors: {
      badge:  'bg-red-50 text-red-600 border-red-200 ring-red-100',
      bar:    'from-red-400 to-rose-500',
      avatar: 'bg-red-100 text-red-700',
      box:    'bg-red-50/50 border-red-100',
      btn:    'bg-red-500 hover:bg-red-600 shadow-red-200/60',
      dot:    'bg-red-400',
      tab:    'text-red-600 bg-red-50 border-red-200',
    },
  },
};

/* Which actions are available per status */
const ACTIONS = {
  Pending:   [{ to: 'Confirmed', label: 'Confirm Order',    icon: FiCheck,       style: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50' },
              { to: 'Cancelled', label: 'Cancel Order',     icon: FiXCircle,     style: 'bg-white hover:bg-red-50 text-red-500 border border-red-200' }],
  Confirmed: [{ to: 'Delivered', label: 'Mark Delivered',   icon: FiTruck,       style: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50' },
              { to: 'Cancelled', label: 'Cancel Order',     icon: FiXCircle,     style: 'bg-white hover:bg-red-50 text-red-500 border border-red-200' }],
  Delivered: [],   // no actions — order is complete
  Cancelled: [{ to: 'Pending',   label: 'Reopen Order',     icon: FiRefreshCw,   style: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200/50' }],
};

const TABS = ['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'];

/* ── Order Card ── */
function OrderCard({ order, onUpdate, onDelete, index }) {
  const cfg = S[order.status];
  const Icon = cfg.icon;
  const actions = ACTIONS[order.status] || [];
  const isDelivered = order.status === 'Delivered';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,16,8,0.10)] transition-all duration-300"
    >
      {/* Gradient top bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${cfg.colors.bar}`} />

      <div className="p-5 sm:p-6">
        {/* ── Top row ── */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl ${cfg.colors.avatar} flex items-center justify-center font-bold text-base flex-shrink-0 select-none`}>
              {order.customerName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-dark text-[15px] leading-tight truncate">{order.customerName}</p>
              <p className="text-[11px] text-muted font-mono mt-0.5 tracking-wide">
                #{order._id?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Price + status badge */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {order.totalPrice > 0 && (
              <p className="text-lg font-bold text-dark leading-none">
                ₹{order.totalPrice.toLocaleString()}
              </p>
            )}
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ring-2 ${cfg.colors.badge}`}>
              <Icon size={10} strokeWidth={2.5} />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* ── Cake info box ── */}
        <div className={`${cfg.colors.box} border rounded-xl px-4 py-3 mb-4`}>
          <div className="flex items-start gap-2.5">
            <FiPackage size={13} className="text-muted mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark leading-snug">{order.cake}</p>
              {order.message && (
                <p className="text-xs text-muted mt-1 flex items-center gap-1.5 italic">
                  <FiMessageSquare size={10} className="flex-shrink-0" />
                  "{order.message}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Meta chips ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { icon: FiPhone,    val: order.phone },
            { icon: FiCalendar, val: order.deliveryDate },
            { icon: FiMapPin,   val: order.address, truncate: true },
          ].map(({ icon: Ic, val, truncate }, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
              <Ic size={10} className="text-brand-400 flex-shrink-0" />
              <span className={truncate ? 'truncate max-w-[160px] sm:max-w-[220px]' : ''}>{val}</span>
            </span>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* ── Actions row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* Status action buttons */}
          <div className="flex flex-wrap gap-2">
            {isDelivered ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                <FiCheckCircle size={13} />
                Order Completed
              </div>
            ) : (
              actions.map(({ to, label, icon: Ic, style }) => (
                <motion.button key={to} whileTap={{ scale: 0.94 }}
                  onClick={() => onUpdate(order._id, to)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all duration-200 ${style}`}>
                  <Ic size={12} strokeWidth={2.5} />
                  {label}
                </motion.button>
              ))
            )}
          </div>

          {/* Delete — hidden when delivered */}
          {!isDelivered && (
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => onDelete(order._id)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-xl transition-all duration-200 self-start sm:self-auto whitespace-nowrap">
              <FiTrash2 size={12} />
              Delete
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

  const loadOrders = () => {
    setLoading(true);
    API.get('/orders')
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
    toast.success(`Order ${status.toLowerCase()}`, { duration: 2000 });
    loadOrders();
  };

  const deleteOrder = async id => {
    if (!confirm('Delete this order permanently?')) return;
    await API.delete(`/orders/${id}`);
    toast.success('Order deleted');
    loadOrders();
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);
  const counts   = TABS.reduce((a, s) => ({ ...a, [s]: s === 'All' ? orders.length : orders.filter(o => o.status === s).length }), {});

  return (
    <div className="max-w-4xl w-full">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark tracking-tight">Orders</h1>
          <p className="text-muted text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-muted">Live</span>
          <button onClick={loadOrders}
            className="ml-1 p-2 rounded-xl hover:bg-gray-100 text-muted hover:text-dark transition-colors">
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {TABS.map(tab => {
          const active = filter === tab;
          const cfg    = tab !== 'All' ? S[tab] : null;
          return (
            <motion.button key={tab} whileTap={{ scale: 0.95 }} onClick={() => setFilter(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-200 ${
                active
                  ? 'bg-dark text-white border-dark shadow-md'
                  : 'bg-white text-muted border-gray-200 hover:border-gray-300 hover:text-dark'
              }`}>
              {cfg && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.colors.dot}`} />}
              {tab}
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-muted'
              }`}>
                {counts[tab]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Summary strip ── */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {['Pending','Confirmed','Delivered','Cancelled'].map(s => {
            const cfg = S[s];
            const Icon = cfg.icon;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  filter === s ? `${cfg.colors.tab} shadow-sm` : 'bg-white border-gray-100 hover:border-gray-200'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.colors.avatar}`}>
                  <Icon size={14} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-lg font-bold text-dark leading-none">{counts[s]}</p>
                  <p className="text-[10px] text-muted truncate">{s}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-[3px] bg-gray-100" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded-lg w-28" />
                      <div className="h-3 bg-gray-100 rounded-lg w-16" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-5 bg-gray-100 rounded-lg w-16" />
                    <div className="h-5 bg-gray-100 rounded-lg w-20" />
                  </div>
                </div>
                <div className="h-14 bg-gray-50 rounded-xl" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-lg w-20" />
                  <div className="h-6 bg-gray-100 rounded-lg w-24" />
                  <div className="h-6 bg-gray-100 rounded-lg w-28" />
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex gap-2">
                  <div className="h-9 bg-gray-100 rounded-xl w-32" />
                  <div className="h-9 bg-gray-100 rounded-xl w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FiPackage size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-dark mb-1">No orders here</p>
          <p className="text-muted text-sm">
            {filter !== 'All' ? `No ${filter.toLowerCase()} orders yet` : 'Orders will appear once placed'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((order, i) => (
              <OrderCard key={order._id} order={order} index={i}
                onUpdate={updateStatus} onDelete={deleteOrder} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
