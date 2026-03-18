import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiPackage } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:5000';

export default function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCakes = () => {
    API.get('/cakes').then(r => { setCakes(r.data); setLoading(false); });
  };

  useEffect(() => { fetchCakes(); }, []);

  const deleteCake = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await API.delete(`/cakes/${id}`);
    toast.success('Cake deleted');
    fetchCakes();
  };

  const filtered = search
    ? cakes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : cakes;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-dark tracking-tight">Manage Cakes</h2>
          <p className="text-muted text-sm mt-1">{cakes.length} cakes in your menu</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cakes..."
              className="pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm text-dark placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all w-44 sm:w-52 shadow-sm" />
          </div>
          {/* Add button — fully visible, gold gradient */}
          <Link to="/admin/add-cake"
            className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 whitespace-nowrap flex-shrink-0">
            <FiPlus size={16} strokeWidth={2.5} />
            Add Cake
          </Link>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-48 bg-gradient-to-br from-brand-50 to-brand-100" />
              <div className="p-4 space-y-2.5">
                <div className="h-4 bg-gray-100 rounded-xl w-3/4" />
                <div className="h-3 bg-gray-100 rounded-xl w-1/2" />
                <div className="flex justify-between pt-1">
                  <div className="h-5 bg-gray-100 rounded-xl w-16" />
                  <div className="h-5 bg-gray-100 rounded-xl w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-gray-100">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
            <FiPackage size={28} className="text-brand-300" />
          </div>
          <p className="font-semibold text-dark mb-1">
            {search ? 'No cakes match your search' : 'No cakes added yet'}
          </p>
          <p className="text-muted text-sm mb-6">
            {search ? 'Try a different keyword' : 'Add your first cake to get started'}
          </p>
          {!search && (
            <Link to="/admin/add-cake"
              className="flex items-center gap-2 bg-gold-gradient text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-warm hover:shadow-warm-lg transition-all">
              <FiPlus size={15} /> Add First Cake
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cake, i) => {
            const imgSrc = cake.image?.startsWith('/uploads') ? BASE_URL + cake.image : cake.image;
            const price = cake.isOffer && cake.offerPrice ? cake.offerPrice : cake.price;
            return (
              <motion.div key={cake._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-200 hover:shadow-[0_8px_32px_rgba(28,16,8,0.10)] transition-all duration-400 group">

                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-brand-50">
                  <img src={imgSrc} alt={cake.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'; }} />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/95 text-brand-700 shadow-sm backdrop-blur-sm">
                      {cake.category}
                    </span>
                    {cake.isOffer && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-red-500 text-white shadow-sm">
                        Sale
                      </span>
                    )}
                    {cake.isFeatured && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-brand-500 text-white shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Action buttons — appear on hover */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <Link to={`/admin/edit-cake/${cake._id}`}
                      className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-md">
                      <FiEdit2 size={14} />
                    </Link>
                    <button onClick={() => deleteCake(cake._id, cake.name)}
                      className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-dark text-sm truncate mb-2">{cake.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-brand-600 font-bold text-base">₹{price}</span>
                      {cake.isOffer && cake.offerPrice && (
                        <span className="text-xs text-gray-300 line-through">₹{cake.price}</span>
                      )}
                    </div>
                    {/* Mobile action buttons (always visible on small screens) */}
                    <div className="flex gap-1.5 sm:hidden">
                      <Link to={`/admin/edit-cake/${cake._id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                        <FiEdit2 size={14} />
                      </Link>
                      <button onClick={() => deleteCake(cake._id, cake.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
