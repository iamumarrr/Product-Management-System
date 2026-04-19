import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deleteProduct } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check if the product exists in global context first (useful for freshly added ones)
    const localProduct = products.find((p) => p.id.toString() === id);
    
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
    } else {
      // If we don't have it locally (maybe user directly navigated), fetch it
      const fetchSingleProduct = async () => {
        try {
          const res = await fetch(`https://dummyjson.com/products/${id}`);
          if (!res.ok) throw new Error('Product not found');
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchSingleProduct();
    }
  }, [id, products]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteProduct(product.id);
        navigate('/');
      } catch (e) {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel text-center animate-fade-in" style={{ padding: '4rem' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Home</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || product.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="product-details-container animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="details-card glass-panel">
        <div className="details-image-section">
          <img src={imageUrl} alt={product.title} className="details-main-image" />
          {product.images && product.images.length > 1 && (
            <div className="details-gallery">
              {product.images.slice(1, 4).map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="gallery-thumbnail" />
              ))}
            </div>
          )}
        </div>
        
        <div className="details-info-section">
          <div className="details-header">
            {product.brand && <span className="brand-badge">{product.brand}</span>}
            {product.category && <span className="category-badge">{product.category}</span>}
          </div>
          
          <h1 className="details-title">{product.title}</h1>
          
          <div className="details-price-rating">
            <span className="details-price">${product.price}</span>
            {product.rating && (
              <span className="details-rating">⭐ {product.rating.toFixed(1)}</span>
            )}
          </div>
          
          <div className="details-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="details-meta">
            {product.stock !== undefined && (
              <div className="meta-item">
                <span className="meta-label">Stock:</span>
                <span className={`meta-value ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                  {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                </span>
              </div>
            )}
            {product.discountPercentage !== undefined && (
              <div className="meta-item">
                <span className="meta-label">Discount:</span>
                <span className="meta-value text-success">{product.discountPercentage}% OFF</span>
              </div>
            )}
          </div>
          
          <div className="details-actions">
            <Link to={`/edit/${product.id}`} className="btn btn-primary" style={{ flex: 1 }}>
              <Edit2 size={18} /> Edit Product
            </Link>
            <button onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>
              <Trash2 size={18} /> {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
