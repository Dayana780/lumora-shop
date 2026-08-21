// src/config/adminMenu.js
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

const adminMenu = [
  { path: "/admin", title: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", title: "Products", icon: Package },
  { path: "/admin/orders", title: "Orders", icon: ShoppingCart },
  { path: "/admin/review", title: "Review", icon: ShoppingCart },
  { path: "/admin/users", title: "Users", icon: Users },
  { path: "/admin/settings", title: "Settings", icon: Settings },
];

export default adminMenu;
