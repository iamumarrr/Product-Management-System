import React, { useContext } from 'react';
import ProductForm from '../components/ProductForm';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { addProduct, error } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="page-title text-center">Add New Product</h1>
      {error && <div className="error-banner">{error}</div>}
      <ProductForm 
        onSubmit={async (data) => {
          await addProduct(data);
        }} 
        isEditing={false} 
      />
    </>
  );
};

export default AddProduct;
