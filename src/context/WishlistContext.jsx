import { createContext, useState } from "react";
 const WishlistContext = createContext();

 function WishlistProvider({children}){

    const [wishlist , setWishlist]= useState([])
    
    function addToWishlist(product){
       const existingProduct=  wishlist.find((item)=>item.id===product.id)
       if(existingProduct) return;
       
        
setWishlist([
    ...wishlist,
    product
]);       
    }
    function removeFromWishlist(id){
        setWishlist(wishlist.filter((item)=>item.id!==id))
    }
    return (
        <WishlistContext.Provider    value={{
        wishlist,
        addToWishlist,removeFromWishlist
    }}>
            {children}
        </WishlistContext.Provider>
    )
 }

 export default WishlistProvider
 export  {WishlistContext}
 