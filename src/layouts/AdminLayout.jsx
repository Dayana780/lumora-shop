import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <h1 className="text-amber-500"> ADMIN LAYOUT</h1>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
