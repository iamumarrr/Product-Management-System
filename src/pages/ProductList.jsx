import React, { useContext, useMemo } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const { products, loading, error, searchTerm, deleteProduct, fetchProducts } = useContext(ProductContext);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(lowerSearch));
  }, [products, searchTerm]);

  if (loading && products.length === 0) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="error-banner">
        <strong>Error:</strong> {error}
        <button onClick={fetchProducts} className="btn btn-secondary" style={{marginLeft: 'auto'}}>Retry</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {searchTerm ? 'Search Results' : 'All Products'}
        </h1>
        <span style={{ color: 'var(--text-muted)' }}>
          {filteredProducts.length} item{filteredProducts.length !== 1 && 's'} found
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No products found.</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search or add a new product.
          </p>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
