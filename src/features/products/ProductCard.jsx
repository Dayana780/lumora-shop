import { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const image = product.product_images?.[0]?.image_url;
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const isWished = wishlist.some((item) => item.id === product.id);

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(product);
  }

  function handleToggleWishlist(e) {
    e.preventDefault();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush-50">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            No image
          </div>
        )}

        {product.categories?.name && (
          <span className="badge absolute top-3 left-3 bg-white/90 text-[11px] font-medium text-charcoal shadow-sm">
            {product.categories.name}
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWished}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm transition-colors hover:text-rose-600"
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} className={isWished ? "text-rose-500" : ""} />
        </button>

        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-lg bg-charcoal py-2.5 text-xs font-semibold tracking-wide text-white opacity-0 shadow-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag size={14} />
          Add to cart
        </button>
      </div>

      <div className="mt-3.5 space-y-1">
        <h3 className="truncate text-sm font-medium text-charcoal">{product.title}</h3>
        <p className="text-sm font-semibold text-rose-600">
          ${Number(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
