import React from 'react'
import {Routes, Route} from 'react-router-dom'
import CustomerList from './CustomerList'
import CustomerForm from './CustomerForm'; 
import ProductList from './ProductList'
import ProductForm from './ProductForm';
import "./AppStyles.css"; 
import { Home } from './Home';
import { NotFound } from './NotFound';
import OrderForm from './OrderForm';
import OrderList from './OrderList';

function App() {

  return (
    <div className='app-container'>
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='/add-customer/' element={ <CustomerForm /> }/>
        <Route path='/edit-customer/:id/' element={ <CustomerForm /> }/> 
        <Route path='/customers' element={ <CustomerList /> } />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-order" element={<OrderForm/>} />
        <Route path="/orders" element={<OrderList/>} />
        <Route path="*" element={<NotFound />}/>

      </Routes>
    </div>
  )
}

export default App;