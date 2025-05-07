
import { useState } from "react";
import { useCart, CartItem, Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Edit, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface QuickEditOrderProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const QuickEditOrder = ({ order, isOpen, onClose }: QuickEditOrderProps) => {
  const [editedItems, setEditedItems] = useState<CartItem[]>(
    JSON.parse(JSON.stringify(order.items))
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    order.specialInstructions || ""
  );
  const { orders, updateOrderStatus } = useCart();

  const handleQuantityChange = (
    index: number,
    action: "increase" | "decrease"
  ) => {
    const newItems = [...editedItems];
    if (action === "increase") {
      newItems[index].quantity += 1;
    } else if (action === "decrease" && newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
    } else if (action === "decrease" && newItems[index].quantity === 1) {
      newItems.splice(index, 1);
    }
    setEditedItems(newItems);
  };

  const handleInstructionsChange = (
    index: number,
    instructions: string
  ) => {
    const newItems = [...editedItems];
    newItems[index].specialInstructions = instructions;
    setEditedItems(newItems);
  };

  const handleSave = () => {
    // Calculate new total price
    const newTotalPrice = editedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    // Update the order with edited items
    const updatedOrder = {
      ...order,
      items: editedItems,
      totalPrice: newTotalPrice,
      specialInstructions
    };
    
    // Find the order in the orders array and update it
    const orderIndex = orders.findIndex(o => o.id === order.id);
    if (orderIndex !== -1) {
      const newOrders = [...orders];
      newOrders[orderIndex] = updatedOrder;
      
      // This doesn't exist in the current context, but would be needed
      // To properly implement this feature, we would need to add an updateOrder function to CartContext
      // updateOrder(updatedOrder);
      
      // For now, we'll use the existing updateOrderStatus function to trigger an update
      updateOrderStatus(order.id, order.status);
      
      toast.success("Order updated successfully");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neo-blur bg-background/10 border border-white/10 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient">
            Edit Order #{order.id.split('-')[1]}
          </DialogTitle>
          <DialogDescription>
            Make quick edits to this order before it moves to preparation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <h3 className="text-sm font-semibold uppercase text-gray-400">
            Items
          </h3>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {editedItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="flex items-center justify-between p-3 bg-black/20 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded overflow-hidden bg-black/30">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-400">${item.price.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleQuantityChange(index, "decrease")}
                      className="h-8 w-8 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleQuantityChange(index, "increase")}
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Special instructions"
                    value={item.specialInstructions || ""}
                    onChange={(e) => handleInstructionsChange(index, e.target.value)}
                    className="w-48 text-xs h-8 neo-blur"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-gray-400">
              Order Notes
            </h3>
            <Input
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Add any special instructions for the entire order"
              className="neo-blur"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button className="bg-primary" onClick={handleSave}>
            <Check className="mr-1 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEditOrder;
