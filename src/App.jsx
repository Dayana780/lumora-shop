import { Routes, Route } from "react-router-dom";

import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";

import MainLayout from "./layouts/MainLayout";

import  AuthProvider  from "./context/AuthContext";
import  CartProvider  from "./context/CartContext";
import  WishlistProvider  from "./context/WishlistContext";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<Dashboard />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;