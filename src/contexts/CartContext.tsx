
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

export type TableStatus = "available" | "occupied" | "reserved" | "needs-cleaning";
export type TableNote = "waiting-for-bill" | "vip" | "special-request" | "reservation";

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
  // Updated addOrder return type to explicitly return Order
  addOrder: (order: Omit<Order, "id" | "timestamp" | "status" | "paymentCollected">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, estimatedTime?: number) => void;
  updatePaymentStatus: (orderId: string, collected: boolean) => void;
  updateOrder: (updatedOrder: Order) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkPinAuth: (pin: string) => boolean;
  
  // Table management
  tables: {
    id: string;
    status: TableStatus;
    note: TableNote | null;
  }[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  updateTableNote: (tableId: string, note: TableNote | null) => void;
  
  // Service issues
  serviceIssues: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    resolved: boolean;
  }[];
  addServiceIssue: (type: string, description: string) => void;
  resolveServiceIssue: (issueId: string) => void;
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
  const [tables, setTables] = useState<{
    id: string;
    status: TableStatus;
    note: TableNote | null;
  }[]>([]);
  const [serviceIssues, setServiceIssues] = useState<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    resolved: boolean;
  }[]>([]);
  
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    // Load previously stored data
    const savedCart = localStorage.getItem("bytedish-cart");
    const savedTableId = localStorage.getItem("bytedish-table");
    const savedOrders = localStorage.getItem("bytedish-orders");
    const savedUserRole = localStorage.getItem("bytedish-user-role");
    const savedAuthStatus = localStorage.getItem("bytedish-auth-status");
    const savedTables = localStorage.getItem("bytedish-table-statuses");
    const savedIssues = localStorage.getItem("bytedish-service-issues");
    
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
    
    if (savedTables) {
      try {
        setTables(JSON.parse(savedTables));
      } catch (e) {
        console.error("Failed to parse saved tables:", e);
      }
    }
    
    if (savedIssues) {
      try {
        setServiceIssues(JSON.parse(savedIssues));
      } catch (e) {
        console.error("Failed to parse saved issues:", e);
      }
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
  
  // Save tables to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-table-statuses", JSON.stringify(tables));
  }, [tables]);
  
  // Save service issues to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-service-issues", JSON.stringify(serviceIssues));
  }, [serviceIssues]);

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
  
  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order #${updatedOrder.id.split("-")[1]} has been updated`,
    });
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
  
  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prevTables => {
      const existingTable = prevTables.find(t => t.id === tableId);
      if (existingTable) {
        return prevTables.map(t => 
          t.id === tableId ? { ...t, status } : t
        );
      } else {
        return [...prevTables, { id: tableId, status, note: null }];
      }
    });
  };
  
  const updateTableNote = (tableId: string, note: TableNote | null) => {
    setTables(prevTables => {
      const existingTable = prevTables.find(t => t.id === tableId);
      if (existingTable) {
        return prevTables.map(t => 
          t.id === tableId ? { ...t, note } : t
        );
      } else {
        return [...prevTables, { id: tableId, status: "available", note }];
      }
    });
  };
  
  const addServiceIssue = (type: string, description: string) => {
    const newIssue = {
      id: `issue-${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    
    setServiceIssues(prevIssues => [...prevIssues, newIssue]);
    
    toast({
      title: "Issue logged",
      description: `Service issue has been recorded`,
    });
  };
  
  const resolveServiceIssue = (issueId: string) => {
    setServiceIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, resolved: true } : issue
      )
    );
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
        updateOrder,
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        checkPinAuth,
        tables,
        updateTableStatus,
        updateTableNote,
        serviceIssues,
        addServiceIssue,
        resolveServiceIssue
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
