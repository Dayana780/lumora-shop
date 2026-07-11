import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useCart } from "../context/CartContext"; // مسیر را تنظیم کنید

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  return (
    <div>
      <h2>سبد خرید</h2>
      {wishlist.length === 0 ? (
        <p>سبد خرید خالی است</p>
      ) : (
        wishlist.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>قیمت: {product.price}</p>
            <button onClick={() => removeFromWishlist(product.id)}>
              remove
            </button>
            <hr />
            <button onClick={() => addToCart(product)}>Add To Cart</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;
