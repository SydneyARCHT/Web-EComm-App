import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://back-end-e-commerce-api.onrender.com/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError('Failed to fetch customers. Please try again.');
    }
  };


  const deleteCustomer = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://back-end-e-commerce-api.onrender.com/customers/${id}`);
      fetchCustomers(); 
    } catch (error) {
      console.error(`Error deleting customer: ${error}`);
      setError('Failed to delete customer. Please try again.');
    }
  };

  useEffect(() => {
    fetchCustomers(); 
  }, []);

  return (
    <div className="customer-list">
      <NavigationBar />
      <h3>Customers</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <p>ID: {customer.customer_id} - Name: {customer.name}</p>
            <button onClick={() => navigate(`/edit-customer/${customer.id}`)}>Edit</button>
            <button onClick={() => deleteCustomer(customer.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;




