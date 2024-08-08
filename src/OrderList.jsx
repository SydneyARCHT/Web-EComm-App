import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError('Failed to fetch orders. Please try again.');
    }
  };


  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/orders/${id}`);
      fetchOrders(); 
    } catch (error) {
      console.error(`Error deleting order: ${error}`);
      setError('Failed to delete order. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders(); 
  }, []);

  return (
    <div className="order-list">
      <NavigationBar />
      <h3>Orders</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>ID: {order.id} - Customer ID: {order.customer_id} - Date: {order.date}</p>
            <button onClick={() => navigate(`/edit-order/${order.id}`)}>Edit</button>
            <button onClick={() => deleteOrder(order.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;