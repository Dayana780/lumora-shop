import { createContext } from "react";

const CartContext=createContext();

function CartProvider ({children}){
    const cart={
         cartCount: 3
    }

    return(
        <CartContext.Provider value={cart}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
export {CartContext}