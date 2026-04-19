import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      setIsDeleting(true);
      onDelete(product.id).catch(() => setIsDeleting(false));
    }
  };

  // Fallback image if thumbnail is missing
  const imageUrl = product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className={`product-card glass-panel animate-fade-in ${isDeleting ? 'deleting' : ''}`}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={product.title} className="card-image" loading="lazy" />
        <div className="card-price-badge">${product.price}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title" title={product.title}>{product.title}</h3>
        <p className="card-description">{product.description?.substring(0, 60)}...</p>
        
        <div className="card-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary btn-icon-only" title="View Details">
            <Eye size={18} />
          </Link>
          <Link to={`/edit/${product.id}`} className="btn btn-secondary btn-icon-only" title="Edit">
            <Edit2 size={18} />
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-icon-only" title="Delete" disabled={isDeleting}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
