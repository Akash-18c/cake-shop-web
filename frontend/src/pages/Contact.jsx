import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../utils/api';

const contactInfo = [
  { icon: FiPhone,  label: 'Phone',   value: '+91 99077 37323',                    href: 'tel:+919907737323'          },
  { icon: FiMail,   label: 'Email',   value: 'hello@cakepoint.com',                href: 'mailto:hello@cakepoint.com' },
  { icon: FiMapPin, label: 'Address', value: '123 Baker Street, Bandra, Mumbai'                                       },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/messages', form);
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden bg-hero-gradient py-16 sm:py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #e8a03c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-3 block">Reach Out</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/50 text-sm sm:text-base">We'd love to hear from you. Let's make something sweet together!</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid md:grid-cols-2 gap-10 md:gap-14">

        {/* Contact Info */}
        <motion.div {...fadeUp()}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">Contact Information</h2>
          <div className="space-y-3 mb-8">
            {contactInfo.map((c, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-200 hover:shadow-warm transition-all duration-300">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 flex-shrink-0">
                  <c.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-0.5">{c.label}</p>
                  {c.href
                    ? <a href={c.href} className="text-dark font-semibold text-sm hover:text-brand-600 transition-colors">{c.value}</a>
                    : <p className="text-dark font-semibold text-sm">{c.value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          <a href="https://wa.me/919907737323" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(37,211,102,0.3)] w-fit mb-8">
            <FaWhatsapp size={20} /> Chat on WhatsApp
          </a>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-48 sm:h-56 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.8!3d19.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="map" />
          </div>
        </motion.div>

        {/* Form */}
        <motion.div {...fadeUp(0.15)}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                required placeholder="Your name" className="input-field" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Message *</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                required placeholder="Tell us about your cake requirements..." rows={4}
                className="input-field resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              <FiSend size={14} />
              {loading ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
