
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Updated to match the PaymentMethod type in CartContext
type PaymentMethod = "Cash" | "M-Pesa" | "Card";

const CartPage = () => {
  const { items, clearCart, addOrder } = useCart();
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const navigate = useNavigate();

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const order = {
      items: [...items],
      totalPrice: totalAmount,
      specialInstructions: notes,
      paymentMethod,
      tableId: localStorage.getItem("currentTableId") || "1",
    };

    try {
      // Call addOrder and store the result
      const newOrder = addOrder(order);
      
      // Check if newOrder exists and has an id property
      if (newOrder && typeof newOrder === 'object' && 'id' in newOrder) {
        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-status/${newOrder.id}`);
      } else {
        toast.error("Failed to place order. Missing order information.");
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleQuantityChange = (
    itemId: string,
    action: "increase" | "decrease"
  ) => {
    const item = items.find((item) => item.id === itemId);
    if (!item) return;

    if (action === "increase") {
      // Increase quantity
      useCart().updateQuantity(itemId, item.quantity + 1);
    } else if (action === "decrease" && item.quantity > 1) {
      // Decrease quantity, but not below 1
      useCart().updateQuantity(itemId, item.quantity - 1);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-400 mb-6">Your cart is empty</p>
          <Button onClick={() => navigate("/menu")} className="bg-primary">
            Go to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {/* Cart items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleQuantityChange(item.id, "decrease")}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleQuantityChange(item.id, "increase")}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order notes */}
        <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg font-semibold mb-2">Special Instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-md p-3 text-white"
            placeholder="Add any special instructions for your order here..."
            rows={3}
          />
        </div>

        {/* Payment method */}
        <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setPaymentMethod("Cash")}
              className={`p-3 rounded-md transition ${
                paymentMethod === "Cash"
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/20 hover:bg-black/30"
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setPaymentMethod("M-Pesa")}
              className={`p-3 rounded-md transition ${
                paymentMethod === "M-Pesa"
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/20 hover:bg-black/30"
              }`}
            >
              M-Pesa
            </button>
            <button
              onClick={() => setPaymentMethod("Card")}
              className={`p-3 rounded-md transition ${
                paymentMethod === "Card"
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/20 hover:bg-black/30"
              }`}
            >
              Card
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/menu")}
            className="flex-1"
          >
            Back to Menu
          </Button>
          <Button onClick={handlePlaceOrder} className="flex-1 bg-primary">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
