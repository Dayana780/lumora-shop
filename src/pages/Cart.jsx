import { useContext } from "react";
import { CartContext } from "../context/CartContext"; // مسیر را تنظیم کنید

function Cart() {
    const { cart } = useContext(CartContext);

    return (
        <div>
            <h2>سبد خرید</h2>
            {cart.length === 0 ? (
                <p>سبد خرید خالی است</p>
            ) : (
                cart.map((product, index) => (
                    <div key={product.id || index}>
                        <h3>{product.name}</h3>
                        <p>قیمت: {product.price} تومان</p>
                        {product.quantity && <p>تعداد: {product.quantity}</p>}
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default Cart;