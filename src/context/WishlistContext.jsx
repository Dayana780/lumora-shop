import { createContext } from "react";
 const WishlistContext = createContext();

 function WishlistProvider({children}){
    const list = {
        countOption : 5
    }
    return (
        <WishlistContext.Provider value={list}>
            {children}
        </WishlistContext.Provider>
    )
 }

 export default WishlistProvider
 export  {WishlistContext}
 