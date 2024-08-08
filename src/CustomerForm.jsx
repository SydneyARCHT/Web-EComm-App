import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './CustomerForm.css';

function CustomerForm() {
  const { id } = useParams(); // Get the ID from the URL if available
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added state
  const [apiError, setApiError] = useState(null);

  // Fetch customer data if ID is present
  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:5000/customers/${id}`)
        .then(response => setCustomerData(response.data))
        .catch(error => {
          console.error('Error fetching customer data:', error);
          setApiError('Error fetching customer data');
        });
    }
  }, [id]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomerData(prevState => ({ ...prevState, [name]: value }));
  };


  const validateForm = () => {
    const { name, email, phone } = customerData;
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!phone) errors.phone = 'Phone is required';
    return errors;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setApiError(null);
      const apiUrl = id
        ? `http://127.0.0.1:5000/customers/${id}`
        : 'http://127.0.0.1:5000/customers';
      const method = id ? axios.put : axios.post;

      try {
        await method(apiUrl, customerData);
        setCustomerData({ name: '', phone: '', email: '' }); 
        setShowSuccessModal(true); 
        setTimeout(() => navigate('/customers'), 2000); // Redirect after 2 seconds
      } catch (error) {
        console.error('Error submitting customer data:', error);
        setApiError('Error submitting customer data');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  // Handle modal close
  const closeModal = () => setShowSuccessModal(false);

  return (
    <div>
      <NavigationBar />
      <div style={{ padding: '20px' }}>
        {isSubmitting && <div style={{ color: 'blue' }}>Submitting customer data...</div>}
        {apiError && <div style={{ color: 'red' }}>{apiError}</div>}

        <form onSubmit={handleSubmit} style={formStyles}>
          <h3>Add/Edit Customer</h3>

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            style={inputStyles}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            name="phone"
            value={customerData.phone}
            onChange={handleChange}
            style={inputStyles}
          />
          {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            style={inputStyles}
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

          <button type="submit" style={buttonStyles}>Submit</button>
        </form>

        {showSuccessModal && (
          <div style={modalStyles}>
            <div style={modalContentStyles}>
              <h4>Success!</h4>
              <p>The customer has been successfully {id ? 'updated' : 'added'}.</p>
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

export default CustomerForm;