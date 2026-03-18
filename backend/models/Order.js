const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cake: { type: String, required: true },
  cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake' },
  message: { type: String },
  deliveryDate: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
