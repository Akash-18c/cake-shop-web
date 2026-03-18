import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiPlusCircle, FiLogOut, FiMenu, FiX, FiPackage, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';

const navItems = [
  { to: '/admin/dashboard', icon: <FiGrid size={17} />,         label: 'Dashboard' },
  { to: '/admin/cakes',     icon: <FiPackage size={17} />,      label: 'Manage Cakes' },
  { to: '/admin/add-cake',  icon: <FiPlusCircle size={17} />,   label: 'Add Cake' },
  { to: '/admin/orders',    icon: <FiShoppingBag size={17} />,  label: 'Orders' },
  { to: '/admin/messages',  icon: <FiMessageSquare size={17} />, label: 'Messages' },
];

function SidebarContent({ onClose, location, logout, unreadCount = 0 }) {
  return (
    <div className="flex flex-col h-full bg-dark">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-warm flex-shrink-0">
            <span className="text-xl">🎂</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">The Cake Point</p>
            <p className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gold-gradient text-white shadow-warm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}>
              <span className={active ? 'text-white' : 'text-white/40'}>{item.icon}</span>
              {item.label}
              {item.to === '/admin/messages' && unreadCount > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-brand-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              {active && item.to !== '/admin/messages' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <FiExternalLink size={17} /> View Website
        </Link>
        <button onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all">
          <FiLogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };
  const currentLabel = navItems.find(n => n.to === location.pathname)?.label || 'Admin';

  useEffect(() => {
    API.get('/messages')
      .then(r => setUnreadCount(r.data.filter(m => !m.read).length))
      .catch(() => {});
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed h-full z-40 shadow-[4px_0_24px_rgba(28,16,8,0.12)]">
        <SidebarContent onClose={() => {}} location={location} logout={logout} unreadCount={unreadCount} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 z-50 md:hidden shadow-2xl">
              <SidebarContent onClose={() => setSidebarOpen(false)} location={location} logout={logout} unreadCount={unreadCount} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-dark">
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-dark text-sm">{currentLabel}</h2>
              <p className="text-[11px] text-muted hidden sm:block">The Cake Point Admin</p>
            </div>
          </div>
          <Link to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-xl transition-all">
            <FiExternalLink size={13} /> View Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
