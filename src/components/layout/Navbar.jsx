import { Link } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { WishlistContext } from "../../context/WishlistContext"
function Navbar() {
    const {cart}= useContext(CartContext)
    const wishlistCount= useContext(WishlistContext)
    return (
        <nav className="flex gap-2 p-2 bg-pink-300 justify-between">
            <p>logo</p>

            <div className="flex gap-2">
                <Link to="/">home</Link>
                <Link to="/shop">shop</Link>
            </div>
            
            <div className="flex gap-2">
                <Link to="/cart">cart({cart.length})</Link>
                <Link to="/wishlist">wishlist({wishlistCount.countOption})</Link>
                <Link to="/login">login</Link>
            </div>
        </nav>
    )
}

export default Navbar