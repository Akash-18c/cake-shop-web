const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Cake = require('../models/Cake');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.isFeatured = true;
    const cakes = await Cake.find(filter).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const cake = new Cake({ ...req.body, image: imageUrl });
    await cake.save();
    res.status(201).json(cake);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const cake = await Cake.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(cake);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Cake.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cake deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
