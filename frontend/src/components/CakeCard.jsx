import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:5000';

export default function CakeCard({ cake, index = 0 }) {
  const { addToCart } = useCart();
  const price = cake.isOffer && cake.offerPrice ? cake.offerPrice : cake.price;
  const imgSrc = cake.image?.startsWith('/uploads') ? BASE_URL + cake.image : cake.image;
  const discount = cake.isOffer && cake.offerPrice
    ? Math.round(((cake.price - cake.offerPrice) / cake.price) * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group bg-white rounded-3xl overflow-hidden border border-brand-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img src={imgSrc} alt={cake.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          style={{ '--tw-scale-x': 'var(--scale)', '--tw-scale-y': 'var(--scale)' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="tag bg-white/95 text-brand-700 shadow-sm backdrop-blur-sm">{cake.category}</span>
          {discount && <span className="tag bg-red-500 text-white">-{discount}%</span>}
          {cake.isFeatured && <span className="tag bg-brand-500 text-white">⭐ Featured</span>}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 duration-300">
          <FiHeart size={15} />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => { addToCart(cake); toast.success(`${cake.name} added!`, { icon: '🎂' }); }}
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-white py-2.5 rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-shadow">
            <FiShoppingCart size={14} /> Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-[17px] text-dark mb-1 leading-snug">{cake.name}</h3>
        <p className="text-muted text-xs mb-4 line-clamp-2 leading-relaxed">{cake.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-brand-600 font-bold text-xl">₹{price}</span>
            {cake.isOffer && cake.offerPrice && (
              <span className="text-gray-300 line-through text-sm">₹{cake.price}</span>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => { addToCart(cake); toast.success(`${cake.name} added!`, { icon: '🎂' }); }}
            className="flex items-center gap-1.5 bg-brand-50 hover:bg-gold-gradient hover:text-white text-brand-600 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border border-brand-200 hover:border-transparent hover:shadow-warm">
            <FiShoppingCart size={13} /> Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
