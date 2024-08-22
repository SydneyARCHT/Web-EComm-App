import React, {useState, useEffect} from "react";
import NavigationBar from "./NavigationBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]); 
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Fetch product function
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://back-end-e-commerce-api.onrender.com/products'); 
      setProducts(response.data)
    } catch (error)  {
      console.log("Error fetching products:", error)
      setError("Failed to fetch products. Please try again")
    }
  };
      
  // Delete product function 
  const deleteProduct = async (id) => {

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://back-end-e-commerce-api.onrender.com/products/${id}`)
      fetchProducts(); 
    } catch (error) {
      console.error(`Error deleting product: ${error}`);
      setError('Failed to delete product. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, [])

  return (
    <div className="product-list">
      <NavigationBar />
      <h3>Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.product_id}>
            <p>ID: {product.product_id} - {product.name}: ${product.price}</p>
            <button onClick={() => navigate(`/edit-product/${product.product_id}`)}>Edit</button>
            <button onClick={() => deleteProduct(product.product_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default ProductList;