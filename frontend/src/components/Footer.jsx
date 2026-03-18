import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const socials = [
  { icon: <FiInstagram size={15} />, href: '#' },
  { icon: <FiFacebook size={15} />, href: '#' },
  { icon: <FaWhatsapp size={15} />, href: 'https://wa.me/919907737323' },
  { icon: <FiYoutube size={15} />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #e8a03c 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-warm">
              <span className="text-lg">🎂</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg block leading-none">The Cake Point</span>
              <span className="text-[9px] text-brand-400 font-semibold tracking-[0.15em] uppercase">Premium Bakery</span>
            </div>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            Crafting sweet memories with every slice. Made with love, baked to perfection since 2010.
          </p>
          <div className="flex gap-2">
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold-gradient border border-white/10 hover:border-transparent flex items-center justify-center transition-all hover:scale-110 hover:shadow-warm">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-brand-400 mb-5">Quick Links</h4>
          <div className="space-y-3">
            {[['/', 'Home'], ['/cakes', 'Our Cakes'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/admin', 'Admin Panel']].map(([to, label]) => (
              <Link key={to} to={to}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-300 transition-colors group">
                <span className="w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-brand-400 mb-5">Categories</h4>
          <div className="space-y-3">
            {['Chocolate Cakes', 'Birthday Cakes', 'Eggless Cakes', 'Wedding Cakes', 'Custom Cakes'].map(c => (
              <Link key={c} to="/cakes"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-300 transition-colors group">
                <span className="w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-brand-400 mb-5">Contact</h4>
          <div className="space-y-4">
            {[
              { icon: <FiPhone size={13} />, text: '+91 99077 37323', href: 'tel:+919907737323' },
              { icon: <FiMail size={13} />, text: 'hello@cakepoint.com', href: 'mailto:hello@cakepoint.com' },
              { icon: <FiMapPin size={13} />, text: 'Kolkata, West Bengal' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 flex-shrink-0 mt-0.5">
                  {c.icon}
                </div>
                {c.href
                  ? <a href={c.href} className="text-sm text-white/40 hover:text-brand-300 transition-colors">{c.text}</a>
                  : <span className="text-sm text-white/40">{c.text}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/20">
          <span>© 2026 The Cake Point. All rights reserved.</span>
          <span>Made with ❤️ for sweet moments</span>
        </div>
      </div>
    </footer>
  );
}
