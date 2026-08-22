import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import adminMenu from "../../config/adminMenu";
import { NavLink, useNavigate } from "react-router-dom";

function AdminHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initial = user?.email?.[0]?.toUpperCase() || "A";

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Page title */}
        <div className="flex-1 px-3 md:px-0">
          <h2 className="text-base font-semibold text-charcoal sm:text-lg">
            Dashboard
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            className="rounded-xl p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-rose-500"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-100 font-semibold text-rose-600">
              {initial}
            </div>

            <div className="hidden sm:block">
              <p className="max-w-[180px] truncate text-sm font-medium text-charcoal">
                {user?.email || "Admin"}
              </p>

              <span className="text-xs text-stone-500">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-white p-5 shadow-xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold text-charcoal">
                  Lumora
                </h1>

                <p className="text-sm text-stone-500">Admin Panel</p>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 text-stone-500 hover:bg-stone-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-1">
                {adminMenu.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/admin"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? "bg-blush-100 text-rose-600"
                              : "text-stone-500 hover:bg-stone-100 hover:text-charcoal"
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.title}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-stone-500 hover:bg-rose-50 hover:text-rose-600"
            >
              Logout
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
