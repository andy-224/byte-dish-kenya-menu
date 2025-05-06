
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice, tableId, clearCart } = useCart();
  const { toast } = useToast();
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = () => {
    if (!tableId) {
      toast({
        title: "Table not identified",
        description: "Please scan a table QR code first",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      const orderId = "order-" + Date.now().toString().slice(-6);
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-status/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bytedish-soft-gray">
      <div className="bytedish-container">
        <Button 
          variant="ghost" 
          className="p-0 mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Menu
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        {items.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg p-4 shadow-sm flex justify-between animate-fade-in"
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">KES {item.price.toLocaleString()} each</div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 ml-auto text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {item.specialInstructions && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Note:</span> {item.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Special instructions</label>
              <Textarea 
                placeholder="Any allergies or special requests?"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 bg-bytedish-purple hover:bg-bytedish-dark-purple"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-bytedish-soft-gray rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add items from the menu to get started</p>
            <Button 
              className="bg-bytedish-purple hover:bg-bytedish-dark-purple"
              onClick={() => navigate(`/menu/${tableId || 'demo'}`)}
            >
              Browse Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
