import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import adminMenu from "../../config/adminMenu";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto bg-white border-r border-gray-200 flex w-full flex-col border-b  p-4 md:min-h-screen md:w-64 md:border-r md:border-b-0 md:p-5">
      <div className="mb-8 px-2">
        <h1 className="font-display text-2xl font-semibold text-charcoal">
          Lumora
        </h1>
        <p className="text-sm text-stone-500">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-x-auto">
        <ul className="flex min-w-max gap-1 md:block md:space-y-1">
          {adminMenu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
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

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
