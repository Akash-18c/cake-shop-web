import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['Chocolate', 'Birthday', 'Eggless', 'Wedding', 'Custom'];
const BASE_URL = 'http://localhost:5000';

const defaultForm = {
  name: '', price: '', description: '', category: 'Chocolate',
  isOffer: false, offerPrice: '', isFeatured: false, image: '',
};

export default function CakeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      API.get(`/cakes/${id}`).then(r => {
        setForm({ ...r.data, price: r.data.price.toString(), offerPrice: r.data.offerPrice?.toString() || '' });
        const img = r.data.image?.startsWith('/uploads') ? BASE_URL + r.data.image : r.data.image;
        setPreview(img);
      });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') data.append(k, v); });
      if (imageFile) data.append('image', imageFile);

      if (isEdit) {
        await API.put(`/cakes/${id}`, data);
        toast.success('Cake updated!');
      } else {
        await API.post('/cakes', data);
        toast.success('Cake added!');
      }
      navigate('/admin/cakes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display text-2xl font-bold text-dark mb-6">
        {isEdit ? 'Edit Cake' : 'Add New Cake'}
      </h2>

      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5">

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cake Image</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-xl border" />
            )}
            <label className="flex-1 border-2 border-dashed border-brand-200 rounded-2xl p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-all">
              <FiUpload className="mx-auto mb-1 text-gray-400" size={20} />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
          {!imageFile && !isEdit && (
            <div className="mt-2">
              <input name="image" value={form.image} onChange={handleChange}
                placeholder="Or paste image URL" className="input-field text-sm" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cake Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              placeholder="e.g. Chocolate Truffle" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required
            placeholder="Describe the cake..." rows={3} className="input-field resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required
              placeholder="500" min="1" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
            <input type="number" name="offerPrice" value={form.offerPrice} onChange={handleChange}
              placeholder="400" min="1" disabled={!form.isOffer} className="input-field disabled:opacity-50" />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isOffer" checked={form.isOffer} onChange={handleChange}
              className="w-4 h-4 accent-primary-600" />
            <span className="text-sm font-medium text-gray-700">Mark as Offer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
              className="w-4 h-4 accent-primary-600" />
            <span className="text-sm font-medium text-gray-700">Featured on Home</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-4 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : isEdit ? 'Update Cake' : 'Add Cake'}
          </button>
          <button type="button" onClick={() => navigate('/admin/cakes')}
            className="btn-ghost flex-1 py-4">Cancel</button>
        </div>
      </motion.form>
    </div>
  );
}
