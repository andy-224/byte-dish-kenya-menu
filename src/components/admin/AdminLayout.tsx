import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { 
  Menu as MenuIcon,
  X,
  LogOut,
  Home,
  ShoppingBag,
  Table,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole, setUserRole, setIsAuthenticated } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define base menu items that both operators and admins can access
  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin",
    },
    {
      title: "Menu Management",
      icon: <MenuIcon className="h-5 w-5" />,
      path: "/admin/menu",
    },
    {
      title: "Order Management",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/admin/orders",
    },
  ];

  // Add Table Management only for admin role
  if (userRole === "admin") {
    menuItems.push({
      title: "Table Management",
      icon: <Table className="h-5 w-5" />,
      path: "/admin/tables",
    });
  }

  // Add Settings for both roles, but we'll handle permissions inside the settings page
  menuItems.push({
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/admin/settings",
  });

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 neo-blur border-r border-white/10 transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="font-bold text-black">BD</span>
              </div>
              <span className="font-bold text-lg text-gradient">ByteDish</span>
            </Link>
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{userRole === "admin" ? "Administrator" : "Operator"}</div>
                <div className="text-xs text-gray-400">Staff account</div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/20 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
                {isActive(item.path) ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Logout button */}
          <div className="p-4 border-t border-white/10">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 neo-blur border-b border-white/10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 mr-2 rounded-md hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gradient">{title}</h1>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Customer View
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
