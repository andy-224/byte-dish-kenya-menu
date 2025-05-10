
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Bell, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableViewProps {
  tableId: string;
}

const TableView = ({ tableId }: TableViewProps) => {
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const { clearCart } = useCart();
  
  // Extract table number from tableId (assuming format "table-X")
  const tableNumber = tableId.split('-')[1] || tableId;
  
  const handleCallWaiter = () => {
    setIsCallingWaiter(true);
    
    // Simulate sending request to server
    setTimeout(() => {
      toast.success("Waiter has been notified and will be with you shortly");
      setIsCallingWaiter(false);
    }, 1500);
  };
  
  const handleCancelOrder = () => {
    setIsCancellingOrder(true);
    
    // Simulate sending request to server
    setTimeout(() => {
      clearCart();
      toast.success("Your order has been cancelled");
      setIsCancellingOrder(false);
    }, 1500);
  };
  
  return (
    <div className="mb-6 neo-blur rounded-xl p-4 border border-white/10 relative overflow-hidden">
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mr-3">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gradient">You're seated at Table {tableNumber}</h3>
          <p className="text-sm text-gray-400">Welcome! Ready to place your order?</p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button 
          variant="outline" 
          className={cn(
            "flex-1 glass-morphism border-white/10 hover:bg-white/10",
            isCallingWaiter && "bg-primary/20 border-primary/50"
          )}
          onClick={handleCallWaiter}
          disabled={isCallingWaiter}
        >
          <Bell className="mr-2 h-4 w-4" />
          {isCallingWaiter ? "Calling..." : "Call Waiter"}
        </Button>
        
        <Button 
          variant="outline" 
          className={cn(
            "flex-1 glass-morphism border-white/10 hover:bg-white/10 text-destructive hover:text-destructive",
            isCancellingOrder && "bg-destructive/20 border-destructive/50"
          )}
          onClick={handleCancelOrder}
          disabled={isCancellingOrder}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isCancellingOrder ? "Cancelling..." : "Cancel Order"}
        </Button>
      </div>
    </div>
  );
};

export default TableView;
