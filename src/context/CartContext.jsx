import { createContext, useState } from "react";

const CartContext=createContext();

function CartProvider ({children}){
    const [cart , setCart]=useState([])
//    const cart = [
//     {
//         id: "1",
//         name: "Lip Tint",
//         price: 250
//     },

//     {
//         id: "2",
//         name: "Cleanser",
//         price: 400
//     }
// ];
function addToCart(product){
   setCart([...cart , product])
};


    return(
        <CartContext.Provider value={{
    cart,
    addToCart
}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
export {CartContext}