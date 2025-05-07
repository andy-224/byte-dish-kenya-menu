
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  Home,
  Settings,
  ShoppingBag,
  Menu as MenuIcon,
  Table,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import RealTimeQueueView from "@/components/admin/RealTimeQueueView";

const AdminDashboard = () => {
  const { orders, userRole } = useCart();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  // Calculate dashboard stats
  useEffect(() => {
    // Count pending orders (not served)
    const pending = orders.filter(order => order.status !== "served").length;
    setPendingOrders(pending);
    
    // Count today's orders and revenue
    const today = new Date().setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter(order => 
      new Date(order.timestamp).getTime() >= today
    );
    
    setTodayOrders(todaysOrders.length);
    setTodayRevenue(
      todaysOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    );
  }, [orders]);

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome to ByteDish Admin Panel">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="neo-blur p-6 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Pending Orders</div>
            <div className="text-3xl font-bold text-gradient">{pendingOrders}</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-red-400" />
          </div>
        </div>
        
        <div className="neo-blur p-6 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Today's Orders</div>
            <div className="text-3xl font-bold text-gradient">{todayOrders}</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        
        <div className="neo-blur p-6 rounded-xl border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Today's Revenue</div>
            <div className="text-3xl font-bold text-gradient">${todayRevenue.toFixed(2)}</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
            <User className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>
      
      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/orders" className="neo-blur border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors">
          <ShoppingBag className="h-8 w-8 text-bytedish-neon-blue mb-4" />
          <h3 className="font-semibold text-lg mb-1">Orders</h3>
          <p className="text-sm text-gray-400">Manage customer orders</p>
        </Link>
        
        <Link to="/admin/menu" className="neo-blur border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors">
          <MenuIcon className="h-8 w-8 text-bytedish-neon-blue mb-4" />
          <h3 className="font-semibold text-lg mb-1">Menu</h3>
          <p className="text-sm text-gray-400">Update menu items</p>
        </Link>
        
        <Link to="/admin/tables" className="neo-blur border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors">
          <Table className="h-8 w-8 text-bytedish-neon-blue mb-4" />
          <h3 className="font-semibold text-lg mb-1">Tables</h3>
          <p className="text-sm text-gray-400">Manage tables & QR codes</p>
        </Link>
        
        <Link to="/admin/operator" className="neo-blur border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-colors">
          <AlertCircle className="h-8 w-8 text-bytedish-neon-blue mb-4" />
          <h3 className="font-semibold text-lg mb-1">Operator Tools</h3>
          <p className="text-sm text-gray-400">Service issues & shifts</p>
        </Link>
      </div>
      
      {/* Quick view of pending orders */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Latest Orders</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/orders">View All</Link>
          </Button>
        </div>
        
        <RealTimeQueueView />
      </div>
      
      {/* Admin-only section */}
      {userRole === "admin" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Admin Tools</h2>
          </div>
          
          <div className="neo-blur border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold">System Settings</h3>
                  <p className="text-sm text-gray-400">Configure app settings and preferences</p>
                </div>
              </div>
              
              <Button asChild variant="default" size="sm" className="bg-primary">
                <Link to="/admin/settings">Open Settings</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
