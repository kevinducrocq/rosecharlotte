import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SigninPage from './pages/SigninPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import SignupPage from './pages/SignupPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/admin/DashboardPage';
import AdminRoute from './components/AdminRoute';
import ProductListPage from './pages/admin/ProductListPage';
import ProductAddPage from './pages/admin/ProductAddPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import ReviewListPage from './pages/admin/ReviewListPage';
import ContactPage from './pages/ContactPage';
import CgvPage from './pages/CgvPage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';
import ServiceClientPage from './pages/ServiceClientPage';
import PromoPage from './pages/PromoPage';
import SoldePage from './pages/SoldesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer
          position="bottom-center"
          limit={1}
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />

        <header>
          <NavigationBar />
        </header>

        <main>
          <div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cgv" element={<CgvPage />} />
              <Route path="/mentions" element={<MentionsLegalesPage />} />
              <Route path="/serviceclient" element={<ServiceClientPage />} />
              <Route path="/boutique/search" element={<SearchPage />} />
              <Route path="/promotions" element={<PromoPage />} />
              <Route path="/soldes" element={<SoldePage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/shipping" element={<ShippingAddressPage />}></Route>
              <Route path="/payment" element={<PaymentMethodPage />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/add"
                element={
                  <AdminRoute>
                    <ProductAddPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/reviews"
                element={
                  <AdminRoute>
                    <ReviewListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/review/:id/validate"
                element={
                  <AdminRoute>
                    <ReviewListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditPage />
                  </AdminRoute>
                }
              ></Route>
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
