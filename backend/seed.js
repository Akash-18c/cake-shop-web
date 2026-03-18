const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const Cake = require('./models/Cake');

const sampleCakes = [
  {
    name: 'Chocolate Truffle Cake',
    price: 650,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=90',
    category: 'Chocolate',
    description: 'Rich, velvety chocolate truffle cake layered with ganache and chocolate shavings.',
    isFeatured: true,
    isOffer: true,
    offerPrice: 550,
  },
  {
    name: 'Rainbow Birthday Cake',
    price: 800,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
    category: 'Birthday',
    description: 'Colorful rainbow layers with vanilla cream frosting. Perfect for birthdays!',
    isFeatured: true,
  },
  {
    name: 'Eggless Vanilla Delight',
    price: 500,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=90',
    category: 'Eggless',
    description: 'Soft, fluffy eggless vanilla cake with fresh cream and fruit toppings.',
    isFeatured: true,
  },
  {
    name: 'Royal Wedding Cake',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=90',
    category: 'Wedding',
    description: 'Elegant 3-tier wedding cake with fondant flowers and gold accents.',
    isFeatured: true,
  },
  {
    name: 'Dark Forest Cake',
    price: 700,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=90',
    category: 'Chocolate',
    description: 'Classic Black Forest with cherries, whipped cream, and dark chocolate.',
    isOffer: true,
    offerPrice: 600,
  },
  {
    name: 'Strawberry Bliss Cake',
    price: 600,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=90',
    category: 'Birthday',
    description: 'Fresh strawberry cake with layers of strawberry compote and cream.',
  },
  {
    name: 'Eggless Red Velvet',
    price: 750,
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=90',
    category: 'Eggless',
    description: 'Stunning red velvet cake with cream cheese frosting — 100% eggless.',
    isOffer: true,
    offerPrice: 650,
  },
  {
    name: 'Floral Wedding Cake',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=90',
    category: 'Wedding',
    description: 'Beautiful 2-tier cake adorned with edible flowers and pearl decorations.',
  },
  {
    name: 'Caramel Drip Cake',
    price: 850,
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&q=90',
    category: 'Custom',
    description: 'Luxurious caramel drip cake with salted caramel layers and gold leaf.',
    isFeatured: true,
    isOffer: true,
    offerPrice: 720,
  },
  {
    name: 'Blueberry Cheesecake',
    price: 700,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=90',
    category: 'Eggless',
    description: 'Creamy no-bake blueberry cheesecake with a buttery biscuit base.',
  },
  {
    name: 'Mango Delight Cake',
    price: 680,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=90',
    category: 'Birthday',
    description: 'Tropical mango mousse cake with fresh mango slices and cream.',
    isFeatured: true,
  },
  {
    name: 'Dark Chocolate Ganache',
    price: 900,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=90',
    category: 'Chocolate',
    description: 'Intense dark chocolate ganache cake for true chocolate lovers.',
    isOffer: true,
    offerPrice: 780,
  },
];

async function seed() {
  try {
    await Cake.deleteMany({});
    await Cake.insertMany(sampleCakes);
    console.log(`✅ ${sampleCakes.length} sample cakes seeded successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
