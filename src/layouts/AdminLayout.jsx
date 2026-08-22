import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-col md:ml-64">
        <AdminHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
