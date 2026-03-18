import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiGift, FiAward } from 'react-icons/fi';
import API from '../utils/api';
import CakeCard from '../components/CakeCard';

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=90',
    tag: 'Bestseller',
    title: 'Crafted for\nEvery Celebration',
    sub: 'Handmade cakes that turn moments into memories.',
  },
  {
    img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1400&q=90',
    tag: 'Wedding Special',
    title: 'Your Dream\nWedding Cake',
    sub: 'Elegant, bespoke wedding cakes made just for you.',
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90',
    tag: 'Birthday Magic',
    title: 'Make Every\nBirthday Special',
    sub: 'Colourful, joyful cakes that everyone will love.',
  },
];

const features = [
  { icon: <FiAward size={22} />, title: 'Premium Quality', desc: 'Finest ingredients, zero compromise' },
  { icon: <FiGift size={22} />, title: 'Custom Orders', desc: 'Personalised for every occasion' },
  { icon: <FiTruck size={22} />, title: 'Same-Day Delivery', desc: 'Fresh to your door, on time' },
  { icon: <FiStar size={22} />, title: '10,000+ Happy Customers', desc: 'Trusted by families across the city' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    API.get('/cakes?featured=true').then(r => setFeatured(r.data.slice(0, 4))).catch(() => {});
    API.get('/cakes').then(r => setOffers(r.data.filter(c => c.isOffer).slice(0, 4))).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = heroSlides[slide];

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-[92vh] min-h-[560px] overflow-hidden">
        {heroSlides.map((sl, i) => (
          <motion.div key={i} className="absolute inset-0"
            animate={{ opacity: i === slide ? 1 : 0 }} transition={{ duration: 1.2 }}>
            <img src={sl.img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        {/* Layered overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <AnimatedHeroContent slide={slide} data={s} />
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === slide ? 'w-8 bg-brand-400' : 'w-2 bg-white/30'}`} />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center">Scroll</span>
          <div className="w-px h-10 bg-white/20" />
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-white border-y border-brand-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}
              className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0 group-hover:bg-gold-gradient group-hover:text-white transition-all duration-300 shadow-sm">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-dark text-sm">{f.title}</p>
                <p className="text-muted text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED CAKES ── */}
      {featured.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Handpicked for You</span>
            <h2 className="section-title">Featured Cakes</h2>
            <p className="section-sub">Our most loved creations, crafted with the finest ingredients</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((cake, i) => <CakeCard key={cake._id} cake={cake} index={i} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/cakes" className="btn-ghost inline-flex">
              View All Cakes <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* ── STORY SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()} className="relative">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=90"
              alt="bakery" className="rounded-3xl w-full h-[420px] object-cover shadow-warm-lg" />
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 md:right-[-24px] bg-white rounded-2xl shadow-card-hover p-5 border border-brand-100/60">
              <p className="text-3xl font-display font-bold text-brand-600">14+</p>
              <p className="text-xs text-muted font-medium mt-0.5">Years of Baking</p>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-4">Our Story</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark leading-tight mb-6">
              Baked with Passion<br />
              <span className="italic text-brand-500">Since 2010</span>
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              The Cake Point started as a small home bakery with one simple dream — to make every celebration sweeter.
              Today, we craft hundreds of cakes every week, each one made with the finest ingredients and a whole lot of love.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              From intimate birthday cakes to grand wedding centrepieces, every creation that leaves our kitchen carries our promise of quality, freshness, and joy.
            </p>
            <Link to="/about" className="btn-primary">
              Our Story <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── OFFERS ── */}
      {offers.length > 0 && (
        <section className="py-20 bg-warm-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">Limited Time</span>
              <h2 className="section-title">Special Offers</h2>
              <p className="section-sub">Grab these deals before they're gone!</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offers.map((cake, i) => <CakeCard key={cake._id} cake={cake} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #e8a03c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div {...fadeUp()} className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-4">Ready to Order?</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Your Dream Cake<br />
            <span className="italic text-brand-400">Awaits You</span>
          </h2>
          <p className="text-white/50 mb-10 text-base md:text-lg">
            Custom cakes for birthdays, weddings, and every sweet moment in between.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/cakes" className="btn-primary px-8 py-4 text-base">
              Order Now <FiArrowRight />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-base transition-all">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

function AnimatedHeroContent({ slide, data }) {
  return (
    <motion.div key={slide} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-xl">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-400 border border-brand-400/30 bg-brand-400/10 px-4 py-1.5 rounded-full mb-5">
        ✦ {data.tag}
      </span>
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-5 whitespace-pre-line">
        {data.title}
      </h1>
      <p className="text-white/60 text-base md:text-lg mb-8 leading-relaxed">{data.sub}</p>
      <div className="flex flex-wrap gap-4">
        <Link to="/cakes" className="btn-primary px-8 py-4 text-base">
          Order Now <FiArrowRight />
        </Link>
        <Link to="/cakes"
          className="inline-flex items-center gap-2 border-2 border-white/25 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-base transition-all">
          View Menu
        </Link>
      </div>
    </motion.div>
  );
}
