import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiLock, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/cakes', label: 'Cakes' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const MARQUEE_TEXT = [
  '✦ This is a Demo Website',
  '✦ Fully customizable to your brand',
  '✦ Custom colors, logo & content',
  '✦ Admin panel included',
  '✦ WhatsApp & order system ready',
  '✦ Contact us to get your own',
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [banner, setBanner]   = useState(true);
  const { cart } = useCart();
  const location = useLocation();
  const count = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const marqueeItems = [...MARQUEE_TEXT, ...MARQUEE_TEXT]; // duplicate for seamless loop

  return (
    <div className="sticky top-0 z-50">

      {/* ── Marquee Banner ── */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1C1008] overflow-hidden relative"
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#1C1008] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-8 top-0 h-full w-16 bg-gradient-to-l from-[#1C1008] to-transparent z-10 pointer-events-none" />

            <div className="flex items-center h-9 overflow-hidden">
              {/* Scrolling track */}
              <motion.div
                className="flex items-center gap-0 whitespace-nowrap flex-shrink-0"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                {marqueeItems.map((text, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-6 text-[12px] font-medium">
                    <FiZap size={10} className="text-brand-400 flex-shrink-0" />
                    <span className={i % (MARQUEE_TEXT.length) === 0 ? 'text-brand-400 font-bold' : 'text-white/70'}>
                      {text}
                    </span>
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setBanner(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <FiX size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navbar ── */}
      <nav className={`transition-all duration-300 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-2xl shadow-[0_2px_20px_rgba(28,16,8,0.08)]'
          : 'bg-white/90 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">🎂</span>
            </div>
            <div className="leading-none">
              <span className="font-display font-bold text-[17px] text-dark block">The Cake Point</span>
              <span className="text-[9px] text-brand-500 font-semibold tracking-[0.15em] uppercase">Premium Bakery</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === l.to
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-muted hover:text-dark hover:bg-gray-50'
                }`}>
                {l.label}
                {location.pathname === l.to && (
                  <motion.span layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-brand-50 transition-colors group">
              <FiShoppingCart size={20} className="text-muted group-hover:text-brand-600 transition-colors" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-gold-gradient text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-warm">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Admin button — desktop */}
            <Link to="/admin"
              className="hidden md:flex items-center gap-2 bg-[#1C1008] hover:bg-[#2d1a0a] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_4px_14px_rgba(28,16,8,0.35)] hover:-translate-y-0.5 group">
              <FiLock size={11} className="group-hover:rotate-12 transition-transform duration-200" />
              Admin
            </Link>

            {/* Order Now — desktop */}
            <Link to="/cakes" className="hidden md:flex btn-primary py-2.5 px-5 text-sm">
              Order Now
            </Link>

            {/* Hamburger */}
            <button onClick={() => setOpen(!open)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-dark">
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
              className="md:hidden bg-white border-t border-brand-100/60 overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to}
                    className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      location.pathname === l.to ? 'bg-brand-50 text-brand-600' : 'text-muted hover:bg-gray-50 hover:text-dark'
                    }`}>
                    {l.label}
                  </Link>
                ))}
                <div className="pt-2 space-y-2">
                  <Link to="/cakes" className="btn-primary w-full py-3">
                    🎂 Order Now
                  </Link>
                  <Link to="/admin"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold bg-[#1C1008] text-white hover:bg-[#2d1a0a] transition-all">
                    <FiLock size={14} />
                    Admin Panel
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
