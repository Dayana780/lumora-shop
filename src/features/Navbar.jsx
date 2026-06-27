import { Link } from "react-router-dom";
 function Navbar() {
    return (
        <div className="flex gap-2 justify-center bg-pink-300 p-2">
            <img src="../assest/react.svg" alt="logo"/>
            <input type="search" placeholder="search"/>
            <Link to="/cart" >سبدخرید</Link>
            <Link to="/wishlist" >علاقمندی</Link>
            <Link to="/login" >ورود</Link>
        </div>
    )
}

export default Navbar
