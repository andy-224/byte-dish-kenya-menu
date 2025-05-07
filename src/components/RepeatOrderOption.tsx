import { useEffect, useState } from "react";
import { useCart, Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Clock, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface RepeatOrderOptionProps {
  tableId: string;
}

const RepeatOrderOption = ({ tableId }: RepeatOrderOptionProps) => {
  const { orders, addItem } = useCart();
  const [previousOrder, setPreviousOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    // Find the most recent order for this table
    const tableOrders = orders
      .filter(order => order.tableId === tableId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (tableOrders.length > 0) {
      setPreviousOrder(tableOrders[0]);
    }
  }, [tableId, orders]);
  
  if (!previousOrder) {
    return null;
  }
  
  const handleRepeatOrder = () => {
    // Add all items from the previous order to the current cart
    previousOrder.items.forEach(item => {
      addItem({
        ...item,
        quantity: item.quantity,
      });
    });
    
    toast.success("Previous order items added to your cart!");
  };
  
  const getFormattedTime = (timestamp: string) => {
    const orderDate = new Date(timestamp);
    const now = new Date();
    
    // If order is less than 24 hours old, show time
    if (now.getTime() - orderDate.getTime() < 24 * 60 * 60 * 1000) {
      return orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="neo-blur p-4 rounded-lg border border-white/10 mb-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Previous Order</h3>
          </div>
          <span className="text-xs text-gray-400">
            {getFormattedTime(previousOrder.timestamp)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {previousOrder.items.slice(0, 3).map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="bg-white/5 px-2 py-1 rounded text-sm flex items-center"
              >
                <span>{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-xs ml-1 text-gray-400">×{item.quantity}</span>
                )}
              </div>
            ))}
            {previousOrder.items.length > 3 && (
              <div className="bg-white/5 px-2 py-1 rounded text-sm">
                +{previousOrder.items.length - 3} more
              </div>
            )}
          </div>
          
          <Button
            onClick={handleRepeatOrder}
            className="w-full bg-primary"
            size="sm"
          >
            <RotateCw className="mr-1 h-4 w-4" />
            Repeat This Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RepeatOrderOption;
