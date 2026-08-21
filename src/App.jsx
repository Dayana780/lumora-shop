import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Shop = lazy(() => import("./pages/Shop"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));

import MainLayout from "./layouts/MainLayout";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";
import AddressProvider from "./context/AddressContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import GuestRoute from "./components/common/GuestRoute";
import Loading from "./components/ui/Loading";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/common/AdminRoute";
import ProductsPage from "./features/admin/products/ProductPages";
import ProductProvider from "./context/ProductContext";
import OrderProvider from "./context/OrderContext";
import OrderPage from "./features/admin/orders/OrderPage";
import OrderDetails from "./features/admin/orders/OrderDetails";
import AdminUsers from "./features/admin/users/AdminUsers";
import UserDetails from "./features/admin/users/UserDetails";
import AdminReviews from "./features/admin/reviews/AdminReviews";
import Orders from "./features/orders/Orders";
import CustomerOrderDetails from "./features/orders/CustomerOrderDetails";
import Checkout from "./features/orders/Checkout";
import Payment from "./features/orders/Payment";
import Settings from "./pages/admin/setting";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <WishlistProvider>
              <AddressProvider>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="product/:id" element={<ProductDetails />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="faq" element={<FAQ />} />
                      <Route path="privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="terms" element={<Terms />} />
                      <Route
                        path="login"
                        element={
                          <GuestRoute>
                            <Login />
                          </GuestRoute>
                        }
                      />
                      <Route
                        path="register"
                        element={
                          <GuestRoute>
                            <Register />
                          </GuestRoute>
                        }
                      />
                      <Route
                        path="wishlist"
                        element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />{" "}
                      <Route
                        path="profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="payment/:id"
                        element={
                          <ProtectedRoute>
                            <Payment />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="orders/:id"
                        element={
                          <ProtectedRoute>
                            <CustomerOrderDetails />
                          </ProtectedRoute>
                        }
                      />
                    </Route>

                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />

                        <Route path="products" element={<ProductsPage />} />

                        <Route path="orders" element={<OrderPage />} />

                        <Route path="orders/:id" element={<OrderDetails />} />

                        <Route path="users" element={<AdminUsers />} />

                        <Route path="users/:id" element={<UserDetails />} />

                        <Route path="review" element={<AdminReviews />} />
                        <Route path="settings" element={<Settings />} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>{" "}
              </AddressProvider>
            </WishlistProvider>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
