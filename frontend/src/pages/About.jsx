import { motion } from 'framer-motion';
import { FiAward, FiHeart, FiUsers, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const stats = [
  { icon: <FiUsers size={22} />, value: '10,000+', label: 'Happy Customers' },
  { icon: <FiPackage size={22} />, value: '500+',   label: 'Cakes Monthly'  },
  { icon: <FiAward size={22} />,  value: '14+',     label: 'Years Experience'},
  { icon: <FiHeart size={22} />,  value: '100%',    label: 'Made with Love' },
];

const values = [
  { title: 'Premium Ingredients',  desc: 'We source only the finest flour, butter, and chocolate from trusted suppliers.' },
  { title: 'Hygiene First',        desc: 'Our kitchen follows strict food safety standards. Clean, safe, and certified.'  },
  { title: 'Custom Creations',     desc: 'Every cake is unique. We work with you to bring your vision to life.'           },
  { title: 'On-Time Delivery',     desc: 'We respect your celebrations. Your cake arrives fresh and on time, always.'     },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=90"
          alt="bakery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/50 to-transparent flex items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="px-6 sm:px-12 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-3 block">Our Story</span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-2">
              Baked with Passion
            </h1>
            <p className="text-white/50 text-sm sm:text-base">Since 2010</p>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div {...fadeUp()}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-4 block">Who We Are</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark leading-tight mb-5">
              From a Home Kitchen<br />
              <span className="italic text-brand-500">to Your Heart</span>
            </h2>
            <p className="text-muted leading-relaxed mb-4 text-sm sm:text-base">
              The Cake Point was born in 2010 when our founder started baking cakes for friends and family
              from her home kitchen in Mumbai. What started as a passion project quickly grew into something much bigger.
            </p>
            <p className="text-muted leading-relaxed text-sm sm:text-base">
              Today, we operate a full-scale bakery with a team of 15 passionate bakers, delivering joy to thousands of
              families every month. Every cake carries our promise of quality, freshness, and love.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="relative">
            <img src="https://images.unsplash.com/photo-1607478900766-efe13248b125?w=700&q=90"
              alt="baking" className="rounded-3xl shadow-warm-lg w-full h-64 sm:h-80 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-300 mx-auto mb-3">
                {s.icon}
              </div>
              <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white/40 text-xs sm:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3 block">Why Us</span>
            <h2 className="section-title">Why Choose The Cake Point?</h2>
            <p className="section-sub">We don't just bake cakes — we create memories</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 flex gap-4 hover:border-brand-200 hover:shadow-warm transition-all duration-300">
                <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-warm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1 text-sm sm:text-base">{v.title}</h3>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/cakes" className="btn-primary inline-flex">Order a Cake</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
