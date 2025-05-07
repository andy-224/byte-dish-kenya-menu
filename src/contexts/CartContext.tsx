import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available?: boolean;
};

export type CartItem = MenuItem & {
  quantity: number;
  specialInstructions?: string;
};

export type PaymentMethod = "Cash" | "M-Pesa" | "Card";

export type OrderStatus = "placed" | "received" | "preparing" | "ready" | "served";

export type Order = {
  id: string;
  tableId: string;
  items: CartItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentCollected: boolean;
  totalPrice: number;
  specialInstructions?: string;
  timestamp: string;
  estimatedTime?: number;
};

export type UserRole = "customer" | "operator" | "admin";

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  tableId: string | null;
  setTableId: (tableId: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "timestamp" | "status" | "paymentCollected">) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, estimatedTime?: number) => void;
  updatePaymentStatus: (orderId: string, collected: boolean) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkPinAuth: (pin: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock PINs for authentication
const ADMIN_PIN = "1234";
const OPERATOR_PIN = "5678";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bytedish-cart");
    const savedTableId = localStorage.getItem("bytedish-table");
    const savedOrders = localStorage.getItem("bytedish-orders");
    const savedUserRole = localStorage.getItem("bytedish-user-role");
    const savedAuthStatus = localStorage.getItem("bytedish-auth-status");
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart:", e);
      }
    }
    
    if (savedTableId) {
      setTableId(savedTableId);
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse saved orders:", e);
      }
    }

    if (savedUserRole) {
      setUserRole(savedUserRole as UserRole);
    }

    if (savedAuthStatus) {
      setIsAuthenticated(savedAuthStatus === "true");
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bytedish-cart", JSON.stringify(items));
  }, [items]);

  // Save tableId to localStorage when it changes
  useEffect(() => {
    if (tableId) {
      localStorage.setItem("bytedish-table", tableId);
    }
  }, [tableId]);

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-orders", JSON.stringify(orders));
  }, [orders]);

  // Save userRole to localStorage when it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem("bytedish-user-role", userRole);
    } else {
      localStorage.removeItem("bytedish-user-role");
    }
  }, [userRole]);

  // Save authentication status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("bytedish-auth-status", isAuthenticated.toString());
  }, [isAuthenticated]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        toast({
          title: "Item updated",
          description: `${item.name} quantity increased`,
        });
        
        return prevItems.map((i) => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      } else {
        toast({
          title: "Item added",
          description: `${item.name} added to your cart`,
        });
        
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from your cart`,
        });
      }
      return prevItems.filter((item) => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateInstructions = (itemId: string, instructions: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const addOrder = (orderData: Omit<Order, "id" | "timestamp" | "status" | "paymentCollected">) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "placed",
      paymentCollected: false,
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    
    toast({
      title: "Order placed",
      description: `Your order #${newOrder.id.split("-")[1]} has been placed successfully`,
    });
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, estimatedTime?: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status, ...(estimatedTime !== undefined ? { estimatedTime } : {}) }
          : order
      )
    );
    
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      toast({
        title: "Order updated",
        description: `Order #${orderId.split("-")[1]} status changed to ${status}`,
      });
    }
  };

  const updatePaymentStatus = (orderId: string, collected: boolean) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, paymentCollected: collected } : order
      )
    );
    
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      toast({
        title: "Payment status updated",
        description: `Payment for order #${orderId.split("-")[1]} marked as ${collected ? "collected" : "not collected"}`,
      });
    }
  };

  const checkPinAuth = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      setUserRole("admin");
      setIsAuthenticated(true);
      return true;
    } else if (pin === OPERATOR_PIN) {
      setUserRole("operator");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        totalItems,
        totalPrice,
        tableId,
        setTableId,
        orders,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        checkPinAuth
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
