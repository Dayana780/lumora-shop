import { createContext, useState } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (!existingProduct) {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    } else {
      setCart(
        cart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        })
      );
    }
  }
function removeFromCart(id) {
  setCart(cart.filter((item) => item.id !== id));
}
function decreaseQuantity(id) {
  const product = cart.find((item) => item.id === id);

  if (product.quantity === 1) {
    removeFromCart(id);
    return;
  }

  setCart(
    cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }

      return item;
    })
  );
}
function increaseQuantity(id) {
  const product = cart.find((item) => item.id === id);
if (!product) return;


  setCart(
    cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    })
  );
}

  return (
    <CartContext.Provider
   value={{
  cart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity
}}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
export { CartContext };