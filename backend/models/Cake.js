const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: ['Chocolate', 'Birthday', 'Eggless', 'Wedding', 'Custom'], required: true },
  description: { type: String, required: true },
  isOffer: { type: Boolean, default: false },
  offerPrice: { type: Number },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Cake', cakeSchema);
