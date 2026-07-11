import { useContext } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const product = products.find((product) => product.id === Number(id));

  // اول چک کن محصول پیدا شده یا نه
  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div>
      <img src={product.image} alt={product.name} />

      <h1>{product.name}</h1>

      <h2>${product.price}</h2>

      <p>{product.description}</p>

      <button onClick={() => addToCart(product)}>Add To Cart</button>

      {isInWishlist ? (
        <button onClick={() => removeFromWishlist(product.id)}>
          ❤️ Remove
        </button>
      ) : (
        <button onClick={() => addToWishlist(product)}>🤍 Add</button>
      )}
    </div>
  );
}

export default ProductDetails;
