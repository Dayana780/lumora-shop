import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

async function getUserRole(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to load user role:", error);
    return null;
  }

  return data?.role ?? null;
}

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useContext(WishlistContext);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: role } = useQuery({
    queryKey: ["navbar-user-role", user?.id],
    queryFn: () => getUserRole(user.id),
    enabled: Boolean(user?.id),
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = role === "admin";

  const linkClass = ({ isActive }) =>
    `relative py-1 text-sm font-medium tracking-wide transition-colors ${
      isActive
        ? "text-rose-600 after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:w-full after:bg-rose-500"
        : "text-charcoal/75 hover:text-rose-600"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur">
      <div className="hidden bg-rose-600 text-center text-xs font-medium tracking-wide text-white sm:block">
        <p className="py-2">Complimentary shipping on orders over $60</p>
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-wide text-charcoal"
        >
          Lumora
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} items`}
            className="relative rounded-full p-2.5 text-charcoal/75 transition-colors hover:bg-blush-50 hover:text-rose-600"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cart.length} items`}
            className="relative rounded-full p-2.5 text-charcoal/75 transition-colors hover:bg-blush-50 hover:text-rose-600"
          >
            <ShoppingBag size={19} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="ml-2 flex items-center gap-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  aria-label="Dashboard"
                  className="rounded-full p-2.5 text-charcoal/75 transition-colors hover:bg-blush-50 hover:text-rose-600"
                >
                  <LayoutDashboard size={19} />
                </Link>
              )}
              <Link
                to="/profile"
                aria-label="Profile"
                className="rounded-full p-2.5 text-charcoal/75 transition-colors hover:bg-blush-50 hover:text-rose-600"
              >
                <User size={19} />
              </Link>
              <button onClick={logout} className="btn-ghost">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary ml-3 px-5 py-2.5 text-xs">
              Login
            </Link>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-charcoal md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-b border-stone-200 bg-ivory px-4 pb-6 shadow-lg md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-blush-50 text-rose-600" : "text-charcoal/80"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-blush-50 text-rose-600" : "text-charcoal/80"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </NavLink>
            )}

            <div className="mt-3 flex items-center gap-3 border-t border-stone-200 pt-4">
              <Link
                to="/wishlist"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blush-50 py-2.5 text-sm font-medium text-charcoal/80"
                onClick={() => setMenuOpen(false)}
              >
                <Heart size={17} /> Wishlist ({wishlist.length})
              </Link>
              <Link
                to="/cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blush-50 py-2.5 text-sm font-medium text-charcoal/80"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag size={17} /> Cart ({cart.length})
              </Link>
            </div>

            {user ? (
              <div className="mt-3 flex items-center justify-between">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-charcoal/80"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-rose-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary mt-3 w-full"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
