import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

function AdminRoute() {
  const { user, loading: authLoading } = useAuth();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    async function getRole() {
      // هنوز AuthContext دارد user را پیدا می‌کند
      if (authLoading) {
        return;
      }

      // Auth تمام شده ولی کاربر لاگین نیست
      if (!user) {
        setRoleLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to load user role:", error);
        setRoleLoading(false);
        return;
      }

      setRole(data.role);
      setRoleLoading(false);
    }

    getRole();
  }, [user, authLoading]);

  // اول صبر می‌کنیم Auth مشخص کند user داریم یا نه
  if (authLoading) {
    return <div>Checking authentication...</div>;
  }

  // Auth تمام شده و user نداریم
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user داریم ولی هنوز role را از profiles نگرفتیم
  if (roleLoading) {
    return <div>Checking permission...</div>;
  }

  // user داریم ولی admin نیست
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
