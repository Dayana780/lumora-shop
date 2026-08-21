import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    totalPrice,
  } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="mt-2 text-3xl font-semiboldr"> Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="card-surface mt-8 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <ShoppingBag size={32} className="text-stone-500" />
          <p className="font-medium text-charcoal">empity </p>
          <Link to="/shop" className="btn-primary mt-2">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card-surface divide-y divide-stone-200/70 p-2 lg:col-span-2">
            {cart.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-blush-50">
                  {product.product_images?.[0]?.image_url ? (
                    <img
                      src={product.product_images[0].image_url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-charcoal">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-rose-600">
                    {Number(product.price).toLocaleString()} $
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-stone-200 px-1 py-1">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-stone-500 hover:bg-blush-50 hover:text-rose-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-stone-500 hover:bg-blush-50 hover:text-rose-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-stone-500 transition-colors hover:text-rose-600"
                  aria-label="Remove item"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <div className="card-surface h-fit p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Order Summary
            </h2>

            <div className="mt-4 flex justify-between text-sm">
              <span className="text-stone-500">total</span>
              <span className="text-lg font-semibold text-charcoal">
                {Number(totalPrice).toLocaleString()} $
              </span>
            </div>

            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
