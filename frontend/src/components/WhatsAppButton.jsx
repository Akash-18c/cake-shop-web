import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const msg = encodeURIComponent('Hi! I want to order a cake from The Cake Point 🎂');
  return (
    <motion.a href={`https://wa.me/919876543210?text=${msg}`} target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] transition-all group">
      <FaWhatsapp size={22} />
      <span className="text-sm font-semibold hidden sm:block">Order on WhatsApp</span>
    </motion.a>
  );
}
