import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import {Toaster} from "sonner"
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionsPage from './pages/CollectionsPage'
import ProductDetails from './components/Products/ProductDetails'
import CheckOut from './components/Cart/CheckOut'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderDetails from './pages/OrderDetails'
import MyOrder from './pages/MyOrder'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHome from './components/Admin/AdminHome'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProduct from './components/Admin/EditProduct'
import OrderManagement from './components/Admin/OrderManagement'

import {Provider} from "react-redux"
import store from './redux/store'
import ProtectedRoute from './components/Common/ProtectedRoute'
 
const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      {/* User layout */}
      <Route path="/" element={<UserLayout/>}>
      <Route index element={<Home/>}/> 
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/> 
      <Route path="profile" element={<Profile/>}/>
      <Route path="collections/:collection" element ={<CollectionsPage/>}/>
      <Route path="product/:id" element={<ProductDetails/>}/>
      <Route path="/checkout" element = {<CheckOut/>}/> 
      <Route path="/order-confirmation" element={<OrderConfirmation/>}/>
      <Route path="/my-orders" element={<MyOrder/>}/>
      <Route path="/order/:id" element={<OrderDetails/>}/> 
      </Route>
     
       {/* Admin Layout */}
       <Route path="/admin" element={<ProtectedRoute role="admin">
        <AdminLayout/>
        </ProtectedRoute>}>
       <Route index element={<AdminHome />}/>
       <Route path="users" element = {<UserManagement/>}/>
       <Route path="products" element = {<ProductManagement/>}/>
       <Route path="products/:id/edit" element = {<EditProduct/>}/>
       <Route path="orders" element = {<OrderManagement/>}/>
       </Route>
      
    </Routes>
    </BrowserRouter>
    </Provider> 
  )
}

export default App