import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Cakes from './pages/Cakes';
import Cart from './pages/Cart';
import Order from './pages/Order';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCakes from './pages/admin/AdminCakes';
import CakeForm from './pages/admin/CakeForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMessages from './pages/admin/AdminMessages';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" replace />;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/cakes" element={<PublicLayout><Cakes /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/order" element={<PublicLayout><Order /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/cakes" element={
            <ProtectedRoute><AdminLayout><AdminCakes /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/add-cake" element={
            <ProtectedRoute><AdminLayout><CakeForm /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/edit-cake/:id" element={
            <ProtectedRoute><AdminLayout><CakeForm /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
