import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css'; // Import the CSS file for styling

function ProductForm() {
  const { id } = useParams(); // Get the product ID from the URL if available
  const navigate = useNavigate();
  const [productData, setProductData] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch product data if ID is present
  useEffect(() => {
    if (id) {
      axios.get(`https://back-end-e-commerce-api.onrender.com/products/${id}`)
        .then(response => setProductData(response.data))
        .catch(error => {
          console.error('Error fetching product data:', error);
          setApiError('Error fetching product data');
        });
    }
  }, [id]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData(prevState => ({ ...prevState, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    const { name, price } = productData;
    const errors = {};
    if (!name) errors.name = 'Product name is required';
    if (!price || price <= 0) errors.price = 'Price must be a positive number';
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setApiError(null);
      const apiUrl = id
        ? `https://back-end-e-commerce-api.onrender.com/products/${id}`
        : 'https://back-end-e-commerce-api.onrender.com/products';
      const method = id ? axios.put : axios.post;

      try {
        await method(apiUrl, productData);
        setProductData({ name: '', price: '' });
        setShowSuccessModal(true); 
        setTimeout(() => navigate('/products'), 2000); // Redirect to product list or another route
      } catch (error) {
        console.error('Error submitting product data:', error);
        setApiError('Error submitting product data');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const closeModal = () => setShowSuccessModal(false);

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: '20px' }}>
        {isSubmitting && <div style={{ color: 'blue' }}>Submitting product data...</div>}
        {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
  
        <form onSubmit={handleSubmit} style={formStyles}>
          <h3>{id ? 'Edit Product' : 'Add Product'}</h3>
  
          <label htmlFor="name">
            Name:
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              style={inputStyles}
            />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </label>
  
          <br />
  
          <label htmlFor="price">
            Price:
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              style={inputStyles}
            />
            {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
          </label>
  
          <br />
  
          <button type="submit" style={buttonStyles}>Submit</button>
        </form>
  
        {showSuccessModal && (
          <div style={modalStyles}>
            <div style={modalContentStyles}>
              <h4>Success!</h4>
              <p>The Product has been successfully {id ? 'updated' : 'added'}.</p>
              <button onClick={closeModal} style={buttonStyles}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  maxWidth: '400px',
  margin: '0 auto'
};

const inputStyles = {
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  width: '100%'
};

const buttonStyles = {
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer'
};

const modalStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%'
};


export default ProductForm;

