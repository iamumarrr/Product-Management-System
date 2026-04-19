import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { Package, Search, Plus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useContext(ProductContext);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Package className="brand-icon" size={28} />
          <span className="brand-text">Nexus<span className="brand-accent">Cart</span></span>
        </Link>
        
        {isHomePage && (
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="navbar-actions">
          <Link to="/add" className="btn btn-primary">
            <Plus size={20} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
