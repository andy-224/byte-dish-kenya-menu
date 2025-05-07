import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  ArrowLeft,
  CreditCard,
  Banknote,
  Phone
} from "lucide-react";
import { useCart, PaymentMethod } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateInstructions, 
    clearCart, 
    totalPrice, 
    tableId,
    addOrder 
  } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("Cash");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!tableId) {
      toast({
        title: "Table not selected",
        description: "Please scan a table QR code first",
        variant: "destructive",
      });
      navigate("/scan");
      return;
    }

    const newOrder = addOrder({
      tableId,
      items,
      totalPrice,
      paymentMethod: selectedPayment,
      specialInstructions
    });
    
    if (!newOrder || !newOrder.id) {
      toast({
        title: "Order error",
        description: "There was an error creating your order",
        variant: "destructive",
      });
      return;
    }

    // Clear cart after order is placed
    clearCart();
    
    // Navigate to order status page
    navigate(`/order-status/${newOrder.id}`);
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
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-white/10" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-gradient">Back</span>
          </Button>
          
          {tableId && (
            <div className="text-right">
              <h2 className="font-semibold text-gradient">{tableId.replace('-', ' ')}</h2>
              <p className="text-xs text-gray-400">ByteDish Restaurant</p>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-gradient">Your Cart</h1>
        
        {items.length > 0 ? (
          <div className="space-y-5 mb-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="neo-blur rounded-xl overflow-hidden border border-white/10 animate-slide-in"
              >
                <div className="flex">
                  <div 
                    className="w-24 h-24 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  
                  <div className="p-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gradient">{item.name}</h3>
                      <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                    
                    {item.specialInstructions && (
                      <p className="text-xs italic text-bytedish-neon-blue mt-1 mb-2">
                        "{item.specialInstructions}"
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 p-0" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusCircle className="h-5 w-5 text-gray-400" />
                        </Button>
                        
                        <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 p-0" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="hover:bg-red-500/20 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-blur rounded-xl p-6 mb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-black/40 to-black/10 backdrop-blur-xl flex items-center justify-center border border-primary/30 shadow-[0_0_25px_rgba(155,135,245,0.4)]">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gradient mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-4">Looks like you haven't added any items yet</p>
            <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary/90">
              Browse Menu
            </Button>
          </div>
        )}
        
        {items.length > 0 && (
          <>
            <div className="neo-blur rounded-xl p-4 mb-6 border border-white/10">
              <h3 className="font-medium mb-3">Special Instructions</h3>
              <Textarea 
                placeholder="Any special requests or notes for the kitchen?"
                className="glass-morphism bg-transparent border-white/10 focus:border-primary/50 text-white resize-none mb-0 neo-blur"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
            
            <div className="neo-blur rounded-xl p-4 mb-6 border border-white/10">
              <h3 className="font-medium mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedPayment === "Cash" 
                      ? "border-bytedish-neon-green bg-bytedish-neon-green/10 text-bytedish-neon-green" 
                      : "border-white/10 bg-black/20 text-gray-400 hover:bg-black/30"
                  }`}
                  onClick={() => setSelectedPayment("Cash")}
                >
                  <Banknote className={`h-6 w-6 mb-2 ${selectedPayment === "Cash" ? "text-bytedish-neon-green" : "text-gray-400"}`} />
                  <span className="text-xs font-medium">Cash</span>
                </button>
                
                <button
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedPayment === "M-Pesa" 
                      ? "border-bytedish-neon-blue bg-bytedish-neon-blue/10 text-bytedish-neon-blue" 
                      : "border-white/10 bg-black/20 text-gray-400 hover:bg-black/30"
                  }`}
                  onClick={() => setSelectedPayment("M-Pesa")}
                >
                  <Phone className={`h-6 w-6 mb-2 ${selectedPayment === "M-Pesa" ? "text-bytedish-neon-blue" : "text-gray-400"}`} />
                  <span className="text-xs font-medium">M-Pesa</span>
                </button>
                
                <button
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    selectedPayment === "Card" 
                      ? "border-bytedish-neon-pink bg-bytedish-neon-pink/10 text-bytedish-neon-pink" 
                      : "border-white/10 bg-black/20 text-gray-400 hover:bg-black/30"
                  }`}
                  onClick={() => setSelectedPayment("Card")}
                >
                  <CreditCard className={`h-6 w-6 mb-2 ${selectedPayment === "Card" ? "text-bytedish-neon-pink" : "text-gray-400"}`} />
                  <span className="text-xs font-medium">Card</span>
                </button>
              </div>
            </div>
            
            <div className="neo-blur rounded-xl p-4 mb-8 border border-white/10">
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Subtotal</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-white/10 my-2"></div>
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-gradient-primary">KES {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(155,135,245,0.4)] transition-all hover:shadow-[0_0_30px_rgba(155,135,245,0.7)] text-lg"
              onClick={handlePlaceOrder}
            >
              Place Order - KES {totalPrice.toLocaleString()}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
