import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useParams, useNavigate } from 'react-router-dom';

function OrderForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({ customer_id: '', date: '', products: '' });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);


  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:5000/orders/${id}`)
        .then(response => {
          const { customer_id, date, products } = response.data;
          setOrderData({ customer_id, date, products: products.join(', ') });
        })
        .catch(error => {
          console.error('Error fetching order data:', error);
          setApiError('Error fetching order data');
        });
    }
  }, [id]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrderData(prevState => ({ ...prevState, [name]: value }));
  };


  const validateForm = () => {
    const { customer_id, date, products } = orderData;
    const errors = {};
    if (!customer_id) errors.customer_id = 'Customer ID is required';
    if (!date) errors.date = 'Date is required';
    if (!products || products.split(',').some(id => isNaN(id.trim()) || id.trim() === '')) {
      errors.products = 'Products must be a comma-separated list of numbers';
    }
    return errors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setApiError(null);
      const apiUrl = id
        ? `http://127.0.0.1:5000/orders/${id}`
        : 'http://127.0.0.1:5000/orders';
      const method = id ? axios.put : axios.post;

      try {
        await method(apiUrl, {
          ...orderData,
          products: orderData.products.split(',').map(id => parseInt(id.trim()))
        });
        setOrderData({ customer_id: '', date: '', products: '' });
        setShowSuccessModal(true); 
        setTimeout(() => navigate('/orders'), 2000); 
      } catch (error) {
        console.error('Error submitting order data:', error);
        setApiError('Error submitting order data');
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
        {isSubmitting && <div style={{ color: 'blue' }}>Submitting order data...</div>}
        {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
  
        <form onSubmit={handleSubmit} style={formStyles}>
          <h3>{id ? 'Edit Order' : 'Add Order'}</h3>
  
          <label htmlFor="customer_id">
            Customer ID:
            <input
              type="number"
              name="customer_id"
              value={orderData.customer_id}
              onChange={handleChange}
              style={inputStyles}
            />
            {errors.customer_id && <div style={{ color: 'red' }}>{errors.customer_id}</div>}
          </label>
  
          <br />
  
          <label htmlFor="date">
            Date:
            <input
              type="date"
              name="date"
              value={orderData.date}
              onChange={handleChange}
              style={inputStyles}
            />
            {errors.date && <div style={{ color: 'red' }}>{errors.date}</div>}
          </label>
  
          <br />
  
          <label htmlFor="products">
            Products (comma separated IDs):
            <input
              type="text"
              name="products"
              value={orderData.products}
              onChange={handleChange}
              style={inputStyles}
            />
            {errors.products && <div style={{ color: 'red' }}>{errors.products}</div>}
          </label>
  
          <br />
  
          <button type="submit" style={buttonStyles}>Submit</button>
        </form>
  
        {showSuccessModal && (
          <div style={modalStyles}>
            <div style={modalContentStyles}>
              <h4>Success!</h4>
              <p>The Order has been successfully {id ? 'updated' : 'added'}.</p>
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

export default OrderForm;