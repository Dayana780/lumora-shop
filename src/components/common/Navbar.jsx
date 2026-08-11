import { Link } from "react-router-dom";
import { useContext } from "react";
import { useCart } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useContext(WishlistContext);
  const { user, logout } = useAuth();

  return (
    <nav className="flex gap-2 p-2 bg-pink-300 justify-between">
      <p>logo</p>

      <div className="flex gap-2">
        <Link to="/">home</Link>
        <Link to="/shop">shop</Link>
      </div>

      <div className="flex gap-2">
        <Link to="/cart">cart({cart.length})</Link>

        <Link to="/wishlist">wishlist({wishlist.length})</Link>

        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
