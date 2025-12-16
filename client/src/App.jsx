import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './pages/Dashboard';
import 'antd/dist/reset.css';
import { useAuth } from './contexts/AuthContext';
import Products from './pages/Products/Products';
import Category from './pages/Category/Category';
import Currency from './pages/Currency/Currency';
import UOM from './pages/UOM/UOM';
import Warehouse from './pages/Warehouse/Warehouse';
import Vendor from './pages/Vendors/Vendor';
import Payment from './pages/Payment/Payment';
import Customer from './pages/Customer/Customer';
import PurchaseOrder from './pages/PurchaseOrder/PurchaseOrder';
import SalesOrder from './pages/SalesOrder/SalesOrder';
import Staff from './pages/Staff/Staff';
import Asset from './pages/Asset/Asset';
import Project from './pages/Project/Project';
import Assembly from './pages/Assembly/Assembly';
import Transfer from './pages/Transfer/Transfer';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import Inventory from './pages/Inventory/Inventory';
import Production from './pages/Production/Production';
import Diesel from './pages/Diesel/Diesel';
import PaymentOrder from './pages/PaymentOrder/PaymentOrder';
import ReceiptOrder from './pages/ReceiptOrder/ReceiptOrder';
import FirstPage from './pages/First Page/FirstPage';
import CustomerReport from './pages/Reports/CustomerReport';
import VendorReport from './pages/Reports/VendorReport';
import StaffHours from './pages/StaffHours/StaffHours';

const App = () => {
  const {isAuthenticated}=useAuth();
  return (
  // <Router>
  //   <Routes>
  //     <Route path='/' element={!isAuthenticated ?<Register /> : <Navigate to={'/dashboard'}/>}/>
  //      <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={'/dashboard'}/>}/>
  //       <Route path='/dashboard' element={isAuthenticated ?<Dashboard /> : <Login /> }/>
  //       <Route path='/Sales' element={isAuthenticated ?<Sales /> : <Login /> }/>
  //   </Routes>
  // </Router>
      <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/registrarion"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes with Dashboard layout */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        >
          {/* Nested routes inside Dashboard */}
          <Route path="products" element={<Products />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="category" element={<Category />} />
          <Route path="currency" element={<Currency />} />
          <Route path="uom" element={<UOM />} />
          <Route path="payment" element={<Payment />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="customer" element={<Customer />} />
          <Route path="purchaseOrder" element={<PurchaseOrder />} />
          <Route path="salesOrder" element={<SalesOrder />} />
          <Route path="staff" element={<Staff />} />
          <Route path="asset" element={<Asset />} />
          <Route path="project" element={<Project />} />
          <Route path="assembly" element={<Assembly />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="projectDetails" element={<ProjectDetails />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="production" element={<Production />} />
          <Route path="diesel" element={<Diesel />} />
          <Route path="paymentOrder" element={<PaymentOrder />} />
          <Route path="receiptOrder" element={<ReceiptOrder />} />
          <Route path="dashboard" element={<FirstPage />} />
          <Route path="customersReports" element={<CustomerReport />} />
          <Route path="vendorsReports" element={<VendorReport />} />
          <Route path="Staff-Working-Hours" element={<StaffHours />} />
          <Route index element={<Navigate to="dashboard" />} /> {/* default redirect */}
        </Route>

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
