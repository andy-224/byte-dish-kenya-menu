
import { useMemo } from "react";
import { useCart, OrderStatus, Order } from "@/contexts/CartContext";
import {
  ShoppingBag,
  Clock,
  ChefHat,
  Check,
  Truck,
} from "lucide-react";

const statusOrder: OrderStatus[] = ["placed", "received", "preparing", "ready", "served"];

const RealTimeQueueView = () => {
  const { orders } = useCart();
  
  // Get all pending orders (not served)
  const pendingOrders = useMemo(() => {
    return orders
      .filter(order => order.status !== "served")
      .sort((a, b) => {
        // First, sort by status priority
        const statusA = statusOrder.indexOf(a.status);
        const statusB = statusOrder.indexOf(b.status);
        
        if (statusA !== statusB) {
          return statusA - statusB;
        }
        
        // If same status, sort by timestamp (oldest first)
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
  }, [orders]);
  
  // Group orders by status
  const ordersByStatus = useMemo(() => {
    const grouped: Record<OrderStatus, Order[]> = {
      placed: [],
      received: [],
      preparing: [],
      ready: [],
      served: [], // We won't actually use this, but needed for type safety
    };
    
    pendingOrders.forEach(order => {
      grouped[order.status].push(order);
    });
    
    return grouped;
  }, [pendingOrders]);
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return <ShoppingBag className="h-4 w-4 text-yellow-400" />;
      case "received":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "preparing":
        return <ChefHat className="h-4 w-4 text-orange-400" />;
      case "ready":
        return <Truck className="h-4 w-4 text-purple-400" />;
      case "served":
        return <Check className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const calculateWaitTime = (timestamp: string) => {
    const orderTime = new Date(timestamp).getTime();
    const now = Date.now();
    const waitMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    return `${waitMinutes} min`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Real-Time Queue</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Placed Orders */}
        <div className="neo-blur rounded-lg border border-yellow-500/30 overflow-hidden">
          <div className="bg-yellow-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 text-yellow-300" />
              <span className="font-medium">New Orders</span>
            </div>
            <span className="text-sm px-2 py-0.5 rounded-full bg-black/30">
              {ordersByStatus.placed.length}
            </span>
          </div>
          
          <div className="divide-y divide-white/10">
            {ordersByStatus.placed.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No new orders
              </div>
            ) : (
              ordersByStatus.placed.map(order => (
                <div key={order.id} className="p-3 hover:bg-white/5">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">#{order.id.split("-")[1]}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        Table {order.tableId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(order.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Received Orders */}
        <div className="neo-blur rounded-lg border border-blue-500/30 overflow-hidden">
          <div className="bg-blue-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-300" />
              <span className="font-medium">Received</span>
            </div>
            <span className="text-sm px-2 py-0.5 rounded-full bg-black/30">
              {ordersByStatus.received.length}
            </span>
          </div>
          
          <div className="divide-y divide-white/10">
            {ordersByStatus.received.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No orders received
              </div>
            ) : (
              ordersByStatus.received.map(order => (
                <div key={order.id} className="p-3 hover:bg-white/5">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">#{order.id.split("-")[1]}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        Table {order.tableId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {calculateWaitTime(order.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Preparing Orders */}
        <div className="neo-blur rounded-lg border border-orange-500/30 overflow-hidden">
          <div className="bg-orange-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4 text-orange-300" />
              <span className="font-medium">Preparing</span>
            </div>
            <span className="text-sm px-2 py-0.5 rounded-full bg-black/30">
              {ordersByStatus.preparing.length}
            </span>
          </div>
          
          <div className="divide-y divide-white/10">
            {ordersByStatus.preparing.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No orders in preparation
              </div>
            ) : (
              ordersByStatus.preparing.map(order => (
                <div key={order.id} className="p-3 hover:bg-white/5">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">#{order.id.split("-")[1]}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        Table {order.tableId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.estimatedTime ? `${order.estimatedTime} min` : "In progress"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Ready Orders */}
        <div className="neo-blur rounded-lg border border-purple-500/30 overflow-hidden">
          <div className="bg-purple-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-purple-300" />
              <span className="font-medium">Ready</span>
            </div>
            <span className="text-sm px-2 py-0.5 rounded-full bg-black/30">
              {ordersByStatus.ready.length}
            </span>
          </div>
          
          <div className="divide-y divide-white/10">
            {ordersByStatus.ready.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No orders ready for delivery
              </div>
            ) : (
              ordersByStatus.ready.map(order => (
                <div key={order.id} className="p-3 hover:bg-white/5">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">#{order.id.split("-")[1]}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        Table {order.tableId}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Ready to serve
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeQueueView;
