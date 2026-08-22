import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";

import adminMenu from "../../config/adminMenu";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    onClose();
    navigate("/login");
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          overflow-y-auto
          border-r border-gray-200
          bg-white p-5
          transition-transform duration-300 ease-in-out

          md:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between px-2">
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              Lumora
            </h1>

            <p className="text-sm text-stone-500">Admin Panel</p>
          </div>

          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-rose-500 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {adminMenu.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors duration-200 ${
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
