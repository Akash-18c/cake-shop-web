import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import API from '../utils/api';
import CakeCard from '../components/CakeCard';

const categories = ['All', 'Chocolate', 'Birthday', 'Eggless', 'Wedding', 'Custom'];
const emojis = { All: '🎂', Chocolate: '🍫', Birthday: '🎉', Eggless: '🌿', Wedding: '💍', Custom: '✨' };

export default function Cakes() {
  const [cakes, setCakes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true); setError(false);
    API.get('/cakes')
      .then(r => { setCakes(r.data); setFiltered(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    let r = cakes;
    if (active !== 'All') r = r.filter(c => c.category === active);
    if (search) r = r.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(r);
  }, [active, search, cakes]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-hero-gradient py-20 px-4 sm:px-6 text-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #e8a03c 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-4">Handcrafted with Love</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">Our Cake Collection</h1>
          <p className="text-white/50 mb-8 text-base">Every cake tells a story — find yours</p>
          <div className="relative max-w-lg mx-auto">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={17} />
            <input type="text" placeholder="Search for your perfect cake..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white rounded-2xl pl-12 pr-12 py-4 text-dark placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-warm-lg text-sm font-medium" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                <FiX size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/96 backdrop-blur-xl border-b border-brand-100/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <motion.button key={cat} whileTap={{ scale: 0.95 }} onClick={() => setActive(cat)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  active === cat
                    ? 'bg-gold-gradient text-white shadow-warm'
                    : 'bg-brand-50 text-muted hover:bg-brand-100 hover:text-dark'
                }`}>
                <span>{emojis[cat]}</span> {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-2">
          <p className="text-muted text-sm">
            Showing <span className="text-brand-600 font-semibold">{filtered.length}</span> cakes
            {active !== 'All' && <> in <span className="text-dark font-semibold">{active}</span></>}
            {search && <> for "<span className="text-dark font-semibold">{search}</span>"</>}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-brand-100/60 animate-pulse">
                <div className="h-56 bg-gradient-to-br from-brand-50 to-brand-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-brand-50 rounded-xl w-3/4" />
                  <div className="h-3 bg-brand-50 rounded-xl w-full" />
                  <div className="h-3 bg-brand-50 rounded-xl w-2/3" />
                  <div className="flex justify-between pt-1">
                    <div className="h-6 bg-brand-50 rounded-xl w-16" />
                    <div className="h-8 bg-brand-50 rounded-xl w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-28">
            <div className="text-7xl mb-5">😕</div>
            <h3 className="font-display text-2xl font-bold text-dark mb-2">Couldn't load cakes</h3>
            <p className="text-muted mb-8">Make sure the backend server is running on port 5000</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-7xl mb-5">🎂</div>
            <h3 className="font-display text-2xl font-bold text-dark mb-2">No cakes found</h3>
            <p className="text-muted mb-8">Try a different category or search term</p>
            <button onClick={() => { setActive('All'); setSearch(''); }} className="btn-ghost">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((cake, i) => <CakeCard key={cake._id} cake={cake} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
