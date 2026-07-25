import { NavLink } from "react-router-dom";
import adminMenu from "../../config/adminMenu";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r p-5 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-pink-600">Lumora</h1>

        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {adminMenu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                    ${isActive ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`
                  }
                >
                  <Icon size={20} />

                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition">
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
