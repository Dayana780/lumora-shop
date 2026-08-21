import { Link } from "react-router-dom";
import { Mail, MessageCircle, Share2 } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-rose-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-semibold">Lumora</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
              Clean, considered beauty essentials crafted for your everyday ritual —
              thoughtfully made, beautifully simple.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <span className="text-xs font-semibold leading-none">ig</span>
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Share2 size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link to="/shop" className="transition-colors hover:text-white">All Products</Link></li>
              <li><Link to="/wishlist" className="transition-colors hover:text-white">Wishlist</Link></li>
              <li><Link to="/cart" className="transition-colors hover:text-white">Cart</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Customer Care</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link to="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-white">Terms &amp; Conditions</Link></li>
              <li className="flex items-center gap-1.5 pt-1">
                <Mail size={14} /> hello@lumora.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumora. All rights reserved.</p>
          <p>Made with care for modern beauty rituals.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
