
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice, tableId, clearCart } = useCart();
  const { toast } = useToast();
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card'>('cash');

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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>
      
      <div className="bytedish-container animate-fade-in">
        <Button 
          variant="ghost" 
          className="p-0 mb-6 hover:bg-white/10" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-gradient">Back to Menu</span>
        </Button>
        
        <h1 className="text-3xl font-bold mb-6 text-gradient">Your Cart</h1>
        
        {items.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="neo-blur rounded-xl p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gradient">{item.name}</h3>
                      <p className="font-semibold text-white">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-3">KES {item.price.toLocaleString()} each</div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-full glass-morphism border border-white/10"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 rounded-full glass-morphism border border-white/10"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 ml-auto text-red-500 hover:text-red-700 hover:bg-white/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {item.specialInstructions && (
                      <div className="mt-2 text-sm text-gray-400 bg-white/5 p-2 rounded-lg border border-white/10">
                        <span className="font-medium">Note:</span> {item.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <label className="block text-sm font-medium mb-1 text-white">Special instructions</label>
              <Textarea 
                placeholder="Any allergies or special requests?"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="glass-morphism bg-transparent border-white/10 focus:border-primary/50 text-white"
              />
            </div>

            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <label className="block text-sm font-medium mb-3 text-white">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentMethod('cash')}
                  className={`rounded-xl h-16 flex flex-col items-center justify-center ${
                    paymentMethod === 'cash'
                      ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(155,135,245,0.5)]'
                      : 'border-white/10 glass-morphism'
                  }`}
                >
                  <span className="text-xs uppercase mb-1">Cash</span>
                  {paymentMethod === 'cash' && <CheckCircle className="h-4 w-4 text-primary" />}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`rounded-xl h-16 flex flex-col items-center justify-center ${
                    paymentMethod === 'mpesa'
                      ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(155,135,245,0.5)]'
                      : 'border-white/10 glass-morphism'
                  }`}
                >
                  <span className="text-xs uppercase mb-1">M-Pesa</span>
                  {paymentMethod === 'mpesa' && <CheckCircle className="h-4 w-4 text-primary" />}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-xl h-16 flex flex-col items-center justify-center ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(155,135,245,0.5)]'
                      : 'border-white/10 glass-morphism'
                  }`}
                >
                  <span className="text-xs uppercase mb-1">Card</span>
                  {paymentMethod === 'card' && <CheckCircle className="h-4 w-4 text-primary" />}
                </Button>
              </div>
            </div>
            
            <div className="neo-blur rounded-xl p-5 mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">KES {totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-white/10 my-2"></div>
              
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-white">Total</span>
                <span className="text-gradient-primary">KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 bg-gradient-to-br from-primary via-primary/90 to-primary/80 hover:bg-primary/90 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(155,135,245,0.4)] transition-all hover:shadow-[0_0_30px_rgba(155,135,245,0.7)] border border-white/10 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </>
        ) : (
          <div className="text-center py-12 neo-blur rounded-xl">
            <div className="w-20 h-20 mx-auto rounded-full neo-blur flex items-center justify-center mb-6 border border-white/10">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-3 text-gradient">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add items from the menu to get started</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)]"
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
