import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";

function AdminLayout() {
  return (
    <div className="h-screen overflow-hidden bg-stone-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-64 flex h-screen min-w-0 flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Scrollable Content */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
