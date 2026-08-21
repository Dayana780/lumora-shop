import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user } = useAuth();
  const initial = user?.email?.[0]?.toUpperCase() || "A";

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <h2 className="text-lg font-semibold text-charcoal">Dashboard</h2>

      <div className="flex items-center gap-5">
        <button className="text-stone-500 transition-colors hover:text-rose-500" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 font-semibold text-rose-600">
            {initial}
          </div>

          <div>
            <p className="max-w-[180px] truncate text-sm font-medium text-charcoal">{user?.email || "Admin"}</p>
            <span className="text-xs text-stone-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
