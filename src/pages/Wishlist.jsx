import { Link } from "react-router-dom";
import { useContext } from "react";
import { Heart } from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../features/products/ProductCard";

function Wishlist() {
  const { wishlist } = useContext(WishlistContext);
  useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Saved for later</p>
        <h1 className="mt-2 text-3xl font-semibold">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="card-surface mx-auto mt-8 flex max-w-md flex-col items-center gap-3 px-6 py-16 text-center">
          <Heart size={32} className="text-stone-500" />
          <p className="font-medium text-charcoal">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary mt-2">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
