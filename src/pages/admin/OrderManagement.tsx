
import { useState, useMemo } from "react";
import { useCart, OrderStatus, Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { FilterX, Clock, Search, ShoppingBag, Check, X, Truck, ChefHat, Edit } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import QuickEditOrder from "@/components/admin/QuickEditOrder";

const OrderManagement = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>("15");
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  
  const { orders, updateOrderStatus, updatePaymentStatus } = useCart();
  const { toast } = useToast();
  
  // Find the order being edited
  const orderBeingEdited = useMemo(() => {
    return editOrderId ? orders.find(order => order.id === editOrderId) || null : null;
  }, [editOrderId, orders]);
  
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    // Apply search filter (table ID or order ID)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.tableId.toLowerCase().includes(searchLower) || 
        order.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by most recent first
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [orders, filterStatus, searchTerm]);
  
  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    if (newStatus === "preparing") {
      setSelectedOrder(order);
    } else {
      updateOrderStatus(order.id, newStatus);
      toast({
        title: "Order status updated",
        description: `Order #${order.id.split("-")[1]} is now ${newStatus}`,
      });
    }
  };
  
  const handleConfirmPreparation = () => {
    if (selectedOrder) {
      updateOrderStatus(
        selectedOrder.id, 
        "preparing", 
        parseInt(estimatedTime) || 15
      );
      toast({
        title: "Order in preparation",
        description: `Order #${selectedOrder.id.split("-")[1]} is being prepared (${estimatedTime} mins)`,
      });
      setSelectedOrder(null);
    }
  };
  
  const handlePaymentToggle = (order: Order) => {
    updatePaymentStatus(order.id, !order.paymentCollected);
    toast({
      title: "Payment status updated",
      description: `Order #${order.id.split("-")[1]} payment marked as ${!order.paymentCollected ? "collected" : "pending"}`,
    });
  };
  
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ["placed", "received", "preparing", "ready", "served"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    
    return null;
  };
  
  const handleEditOrder = (order: Order) => {
    // Only allow editing for placed or received orders
    if (order.status === "placed" || order.status === "received") {
      setEditOrderId(order.id);
    } else {
      toast({
        title: "Cannot edit order",
        description: "Only new or received orders can be edited",
        variant: "destructive"
      });
    }
  };
  
  const formatOrderTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };
  
  const formatOrderDate = (timestamp: string) => {
    const orderDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (orderDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (orderDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return format(orderDate, "dd MMM yyyy");
  };
  
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
  
  // Format currency based on the order's currency type
  const formatCurrency = (price: number, currency: string = "USD") => {
    if (currency === "KSH") {
      return `KSH ${price.toLocaleString()}`;
    } else {
      return `$${price.toLocaleString()}`;
    }
  };
  
  const groupOrdersByDate = (orders: Order[]) => {
    const groups: Record<string, Order[]> = {};
    
    orders.forEach(order => {
      const date = formatOrderDate(order.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
    });
    
    return groups;
  };
  
  const groupedOrders = groupOrdersByDate(filteredOrders);
  
  return (
    <AdminLayout title="Order Management" subtitle="Manage and track orders">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by table or order ID..."
            className="pl-9 neo-blur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-40 neo-blur">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="served">Served</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {filterStatus !== "all" && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setFilterStatus("all")}
              className="hover:bg-white/10"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {Object.keys(groupedOrders).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedOrders).map(([date, dateOrders]) => (
            <div key={date} className="neo-blur rounded-xl overflow-hidden border border-white/10">
              <div className="bg-black/30 px-4 py-3 border-b border-white/10">
                <h3 className="font-medium text-gradient">{date}</h3>
              </div>
              
              <div className="divide-y divide-white/5">
                {dateOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gradient">Order #{order.id.split("-")[1]}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                            {formatOrderTime(order.timestamp)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                            order.status === "placed" ? "bg-yellow-500/20 text-yellow-300" :
                            order.status === "received" ? "bg-blue-500/20 text-blue-300" :
                            order.status === "preparing" ? "bg-orange-500/20 text-orange-300" :
                            order.status === "ready" ? "bg-purple-500/20 text-purple-300" :
                            "bg-green-500/20 text-green-300"
                          }`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mt-1">
                          <span className="text-sm text-gray-400">{order.tableId}</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{formatCurrency(order.totalPrice, order.currency)}</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{order.paymentMethod}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs neo-blur ${
                            order.paymentCollected ? 
                            "bg-green-500/20 text-green-300 border-green-500/30" : 
                            "bg-white/5 text-gray-300 border-white/10"
                          }`}
                          onClick={() => handlePaymentToggle(order)}
                        >
                          {order.paymentCollected ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <X className="h-3.5 w-3.5 mr-1" />
                              Not Paid
                            </>
                          )}
                        </Button>
                        
                        {/* Quick Edit Button - only for placed or received orders */}
                        {(order.status === "placed" || order.status === "received") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs neo-blur bg-amber-500/20 text-amber-300 border-amber-500/30"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        )}
                        
                        {getNextStatus(order.status) && (
                          <Button
                            size="sm"
                            className="text-xs neo-blur bg-bytedish-neon-blue/20 text-bytedish-neon-blue hover:bg-bytedish-neon-blue/30"
                            onClick={() => handleUpdateStatus(order, getNextStatus(order.status) as OrderStatus)}
                          >
                            Mark as {getNextStatus(order.status)}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {order.items.map((item, index) => (
                          <div 
                            key={`${order.id}-${item.id}-${index}`}
                            className="flex items-center p-2 bg-black/20 rounded-md"
                          >
                            <div className="w-8 h-8 rounded overflow-hidden mr-2 bg-black/30">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-gray-400 ml-2 whitespace-nowrap">x{item.quantity}</p>
                              </div>
                              {item.specialInstructions && (
                                <p className="text-xs text-gray-500 truncate">{item.specialInstructions}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="neo-blur rounded-xl p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No orders found</p>
          {(filterStatus !== "all" || searchTerm) && (
            <p className="text-sm text-gray-500 mt-2 mb-4">Try adjusting your filters</p>
          )}
        </div>
      )}
      
      {/* Estimated time dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="neo-blur border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gradient">Set preparation time</DialogTitle>
            <DialogDescription>
              Enter the estimated time to prepare order #{selectedOrder?.id.split("-")[1]}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                className="neo-blur"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
              <span className="text-gray-400">minutes</span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedOrder(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPreparation}
              className="bg-primary hover:bg-primary/90"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Quick Edit Order Dialog */}
      {orderBeingEdited && (
        <QuickEditOrder
          order={orderBeingEdited}
          isOpen={!!editOrderId}
          onClose={() => setEditOrderId(null)}
        />
      )}
    </AdminLayout>
  );
};

export default OrderManagement;
