import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Home,
  FileText,
  Settings,
  Menu,
  Grid,
  Watch,
  Users,
  Clock,
  MessageSquare
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, setUserRole, setIsAuthenticated } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/admin", roles: ["admin", "operator"] },
    { label: "Menu Management", icon: <Menu className="h-5 w-5" />, href: "/admin/menu", roles: ["admin"] },
    { label: "Orders", icon: <FileText className="h-5 w-5" />, href: "/admin/orders", roles: ["admin", "operator"] },
    { label: "Tables", icon: <Grid className="h-5 w-5" />, href: "/admin/tables", roles: ["admin", "operator"] },
    { label: "Table Status", icon: <Clock className="h-5 w-5" />, href: "/admin/table-status", roles: ["admin", "operator"] },
    { label: "Feedback", icon: <MessageSquare className="h-5 w-5" />, href: "/admin/feedback", roles: ["admin", "operator"] },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/admin/settings", roles: ["admin"] },
  ];

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Sidebar>
        <div className="py-4">
          <div className="px-6 mb-8">
            <h2 className="text-2xl font-bold text-gradient">ByteDish</h2>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) =>
              item.roles.includes(userRole || "") ? (
                <li key={item.label}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "justify-start px-6 hover:bg-white/5 w-full font-normal",
                      isActive(item.href) ? "bg-white/5" : ""
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <Button
          variant="ghost"
          className="justify-start px-6 hover:bg-white/5 w-full font-normal absolute bottom-0 left-0"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </Sidebar>
      <main className="flex-1">
        <div className="border-b border-white/5 py-4 px-6">
          <h1 className="text-2xl font-semibold text-gradient">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
