
import { useState } from "react";
import { useCart, Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";

const OrderExport = () => {
  const { orders } = useCart();
  const [exportPeriod, setExportPeriod] = useState("today");
  
  const getFilteredOrders = (): Order[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = new Date(today - 86400000).getTime();
    const thisWeekStart = new Date(today - now.getDay() * 86400000).getTime();
    
    return orders.filter(order => {
      const orderTime = new Date(order.timestamp).getTime();
      
      switch (exportPeriod) {
        case "today":
          return orderTime >= today;
        case "yesterday":
          return orderTime >= yesterday && orderTime < today;
        case "thisWeek":
          return orderTime >= thisWeekStart;
        case "all":
          return true;
        default:
          return true;
      }
    });
  };
  
  const handleExport = () => {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
      toast.error(`No orders found for the selected period: ${exportPeriod}`);
      return;
    }
    
    // Calculate totals
    let totalRevenue = 0;
    let totalItems = 0;
    const paymentMethods: Record<string, number> = {};
    const popularItems: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      totalRevenue += order.totalPrice;
      
      // Count payment methods
      paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
      
      // Count items
      order.items.forEach(item => {
        totalItems += item.quantity;
        popularItems[item.name] = (popularItems[item.name] || 0) + item.quantity;
      });
    });
    
    // Sort popular items
    const sortedItems = Object.entries(popularItems)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);
    
    // Format the summary
    const summary = `
# ByteDish Order Summary
Period: ${exportPeriod}
Generated: ${new Date().toLocaleString()}

## Overview
Total Orders: ${filteredOrders.length}
Total Revenue: $${totalRevenue.toFixed(2)}
Total Items Sold: ${totalItems}

## Payment Methods
${Object.entries(paymentMethods)
  .map(([method, count]) => `- ${method}: ${count} orders (${(count / filteredOrders.length * 100).toFixed(1)}%)`)
  .join('\n')
}

## Most Popular Items
${sortedItems
  .map(([name, count], i) => `${i + 1}. ${name}: ${count} ordered`)
  .join('\n')
}

## Order Details
${filteredOrders
  .map(order => `
Order #${order.id.split('-')[1]} - ${new Date(order.timestamp).toLocaleString()}
Table: ${order.tableId}
Status: ${order.status}
Payment: ${order.paymentMethod} (${order.paymentCollected ? 'Collected' : 'Not Collected'})
Items:
${order.items.map(item => `  - ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`).join('\n')}
Total: $${order.totalPrice.toFixed(2)}
  `)
  .join('\n')
}
    `;
    
    // In a real application, this would create a downloadable file
    // For this demo, we'll just show the data in a new window
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url);
    
    toast.success(`Export successful for ${exportPeriod}`);
  };

  return (
    <div className="neo-blur p-4 rounded-lg border border-white/10 space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Order Export</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Select Period</label>
          <Select
            value={exportPeriod}
            onValueChange={setExportPeriod}
          >
            <SelectTrigger className="neo-blur">
              <SelectValue placeholder="Select export period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today's Orders</SelectItem>
              <SelectItem value="yesterday">Yesterday's Orders</SelectItem>
              <SelectItem value="thisWeek">This Week's Orders</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {getFilteredOrders().length} orders in selected period
          </div>
          
          <Button
            onClick={handleExport}
            className="bg-primary"
          >
            <Download className="mr-1 h-4 w-4" />
            Export Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderExport;
