import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = ({ initialData, onSubmit, isEditing }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    thumbnail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price || '',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || initialData.images?.[0] || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure price is a number
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };

    try {
      await onSubmit(dataToSubmit);
      navigate('/');
    } catch (error) {
      console.error('Submission error', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container glass-panel animate-fade-in">
      <h2 className="form-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. iPhone 14 Pro"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 999"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">Image URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed product description..."
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
            <X size={18} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <Save size={18} /> {isSubmitting ? 'Saving...' : (isEditing ? 'Update Details' : 'Save Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
