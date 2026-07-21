import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Shop = lazy(() => import("./pages/Shop"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));

import MainLayout from "./layouts/MainLayout";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Loading from "./components/ui/Loading";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
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
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
