
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { 
  Clock,
  Calendar,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  Menu,
  Table,
  LogOut
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const { orders, userRole } = useCart();
  
  // Get today's orders
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp).toDateString();
    const todayDate = new Date().toDateString();
    return orderDate === todayDate;
  });

  // Get pending orders (not served yet)
  const pendingOrders = orders.filter(order => order.status !== "served");
  
  // Calculate total sales
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.length,
      icon: <Calendar className="h-6 w-6 text-bytedish-neon-green" />,
      color: "bg-bytedish-neon-green/10 border-bytedish-neon-green/20"
    },
    {
      title: "Pending Orders",
      value: pendingOrders.length,
      icon: <Clock className="h-6 w-6 text-bytedish-neon-blue" />,
      color: "bg-bytedish-neon-blue/10 border-bytedish-neon-blue/20"
    },
    {
      title: "Total Sales",
      value: `KES ${totalSales.toLocaleString()}`,
      icon: <CreditCard className="h-6 w-6 text-bytedish-neon-pink" />,
      color: "bg-bytedish-neon-pink/10 border-bytedish-neon-pink/20"
    },
    {
      title: "Active Tables",
      value: new Set(orders.map(order => order.tableId)).size,
      icon: <Table className="h-6 w-6 text-primary" />,
      color: "bg-primary/10 border-primary/20"
    }
  ];

  const quickActions = [
    {
      title: "Menu Management",
      description: "Add or edit menu items and categories",
      icon: <Menu className="h-10 w-10 text-bytedish-neon-blue" />,
      path: "/admin/menu",
      color: "from-bytedish-neon-blue/20 to-transparent"
    },
    {
      title: "Order Management",
      description: "View and update order statuses",
      icon: <ShoppingBag className="h-10 w-10 text-bytedish-neon-green" />,
      path: "/admin/orders",
      color: "from-bytedish-neon-green/20 to-transparent"
    },
    {
      title: "Table Management",
      description: "Configure tables and generate QR codes",
      icon: <Table className="h-10 w-10 text-bytedish-neon-pink" />,
      path: "/admin/tables",
      color: "from-bytedish-neon-pink/20 to-transparent",
      adminOnly: true
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: <Settings className="h-10 w-10 text-primary" />,
      path: "/admin/settings",
      color: "from-primary/20 to-transparent",
      adminOnly: true
    }
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome to ByteDish Admin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`neo-blur p-4 rounded-xl ${stat.color} animate-slide-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full neo-blur">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gradient mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions
              .filter(action => !action.adminOnly || userRole === "admin")
              .map((action, index) => (
                <Link 
                  key={index} 
                  to={action.path}
                  className="block neo-blur p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-center">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} mr-4`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gradient">{action.title}</h3>
                      <p className="text-sm text-gray-400">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gradient mb-4">Recent Orders</h2>
          {orders.length > 0 ? (
            <div className="neo-blur rounded-xl overflow-hidden border border-white/10">
              <div className="max-h-80 overflow-y-auto scrollbar-none">
                <table className="w-full">
                  <thead className="bg-black/30 sticky top-0">
                    <tr className="text-left">
                      <th className="p-4 text-sm font-medium text-gray-400">Table</th>
                      <th className="p-4 text-sm font-medium text-gray-400">Time</th>
                      <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 5)
                      .map((order, index) => (
                        <tr 
                          key={order.id} 
                          className="border-t border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">{order.tableId}</td>
                          <td className="p-4 text-sm text-gray-400">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "placed" ? "bg-yellow-500/20 text-yellow-300" :
                              order.status === "received" ? "bg-blue-500/20 text-blue-300" :
                              order.status === "preparing" ? "bg-orange-500/20 text-orange-300" :
                              order.status === "ready" ? "bg-purple-500/20 text-purple-300" :
                              "bg-green-500/20 text-green-300"
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4 font-medium">KES {order.totalPrice.toLocaleString()}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-black/20 border-t border-white/10">
                <Link 
                  to="/admin/orders"
                  className="text-sm text-bytedish-neon-blue hover:text-white transition-colors"
                >
                  View all orders →
                </Link>
              </div>
            </div>
          ) : (
            <div className="neo-blur rounded-xl p-8 text-center border border-white/10">
              <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
