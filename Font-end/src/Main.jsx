import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './login/login'
import Home from './home';
import Profile from './component/profile';

//products
import AllCate from './productsShow/allCate';
import Top from './productsShow/tops';
import FullBody from './productsShow/fullBody';
import Bottom from './productsShow/bottoms';
import Accessory from './productsShow/accessories';
import Shoe from './productsShow/shoes';
import Hat from './productsShow/hats';
import Swimwear from './productsShow/swimwear';

//management
import MainManagement from './management/mainManagement';
import SubManagement from './management/subManagement';
import Register from './register/register'
import ManageProducts from './management/manageProducts/manageProducts';
import AddProduct from './management/manageProducts/addProduct';
import EditProduct from './management/manageProducts/editProduct';
import OrderProve from './management/manageProducts/customer/orderProve';
import Report from './management/manageProducts/customer/report';



//card payment
import Cart from './cart/Cart';

const root = ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path = '/' element = {<Login />} />

      <Route path = '/customer' element={<Home />}/ >
      <Route path = '/allcate' element={<AllCate />}/ >
      <Route path = '/top' element={<Top />}/ >
      <Route path = '/fullBody' element={<FullBody />}/ >
      <Route path = '/bottom' element={<Bottom />}/ >
      <Route path = '/accessory' element={<Accessory />}/ >
      <Route path = '/shoe' element={<Shoe />}/ >
      <Route path = '/hat' element={<Hat />}/ >
      <Route path = '/swimwear' element={<Swimwear />}/ >
      <Route path = '/register' element={<Register />}/ >
      <Route path = '/profile' element={<Profile />}/ >


  
      <Route path = '/admin' element={<MainManagement />}/ >
      <Route path = '/manageProduct' element={<ManageProducts />}/ >
      <Route path = '/addProduct' element={<AddProduct />} />
      <Route path = '/editProduct' element={<EditProduct />} />
      <Route path = '/employee' element={<SubManagement />}/ >
      <Route path = '/cart' element={<Cart />}/ >
      <Route path = '/orderProve' element={<OrderProve />}/ >
      <Route path = '/report' element={<Report />}/ >

      </Routes>
  </BrowserRouter>,
);