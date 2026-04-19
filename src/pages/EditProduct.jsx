import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { ProductContext } from '../context/ProductContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct, error } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localProduct = products.find((p) => p.id.toString() === id);
    
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
    } else {
      // In a real app we might fetch it. For now let's just fetch it from API
      const fetchSingle = async () => {
        try {
          const res = await fetch(`https://dummyjson.com/products/${id}`);
          if (!res.ok) throw new Error('Not found');
          const data = await res.json();
          setProduct(data);
        } catch (e) {
          console.error(e);
          navigate('/'); // Redirect if invalid
        } finally {
          setLoading(false);
        }
      };
      fetchSingle();
    }
  }, [id, products, navigate]);

  if (loading) {
    return <div className="loader-container"><div className="spinner"></div></div>;
  }

  return (
    <>
      <h1 className="page-title text-center">Edit Product Database</h1>
      {error && <div className="error-banner">{error}</div>}
      <ProductForm 
        initialData={product}
        onSubmit={async (data) => {
          await updateProduct(product.id, data);
        }} 
        isEditing={true} 
      />
    </>
  );
};

export default EditProduct;
