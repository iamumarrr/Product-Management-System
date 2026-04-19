import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'https://dummyjson.com/products';

  // Fetch all products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // The search endpoint does filtering server-side, but DummyJSON doesn't filter locally added items.
  // We'll fetch from API but also fallback or handle local filtering in the component itself.
  // Actually, to make it search all, including newly added ones, we should just filter the local state 
  // in the component or provide a filtered array here. 
  // For context requirements, we need `searchTerm` state here.
  
  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const newProduct = await response.json();
      
      // DummyJSON returns the new product with an ID. We prepend it locally.
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      // If it's a locally added item (id > 100 usually, DummyJson max is 100 or something, wait new items have large IDs),
      // DummyJSon may throw 404 for updating a fake ID. We'll try-catch the API and always update local state.
      let returnedProduct = { id, ...updatedData };
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (response.ok) {
          returnedProduct = await response.json();
        }
      } catch (e) {
        console.warn('API update failed (normal for local objects), updating local state only.');
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...returnedProduct } : p))
      );
      return returnedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
           console.warn('API deletion returned non-ok, probably local item');
        }
      } catch (e) {
        console.warn('API deletion failed, updating local state only.');
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
