import { useCart } from "../context/CartContext"; // مسیر را تنظیم کنید

function Cart() {
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    totalPrice,
  } = useCart();

  return (
    <div>
      <h2>سبد خرید</h2>
      {cart.length === 0 ? (
        <p>سبد خرید خالی است</p>
      ) : (
        cart.map((product, index) => (
          <div key={product.id || index}>
            <h3>{product.name}</h3>
            <p>تعداد: {product.quantity}</p>
            <p>قیمت: {product.price}</p>
            <button onClick={() => removeFromCart(product.id)}>remove</button>
            <button onClick={() => increaseQuantity(product.id)}>+</button>
            <hr />

            <button onClick={() => decreaseQuantity(product.id)}>-</button>
            <hr />
          </div>
        ))
      )}
      <h2>مجموع: {totalPrice} تومان</h2>
    </div>
  );
}

export default Cart;
