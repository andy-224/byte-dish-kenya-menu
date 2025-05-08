
import { useState, useEffect } from "react";
import { Bell, BellRing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const TableAssistanceAlerts = () => {
  const [callingTables, setCallingTables] = useState<string[]>([]);
  
  // Check for tables requesting assistance
  useEffect(() => {
    // For demo purposes, we're using localStorage
    // In a real app, this would be a subscription to a real-time DB
    const checkCallingTables = () => {
      const tables = JSON.parse(localStorage.getItem('callingTables') || '[]');
      setCallingTables(tables);
    };
    
    // Initial check
    checkCallingTables();
    
    // Set up polling every 5 seconds to check for new requests
    const interval = setInterval(checkCallingTables, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const acknowledgeRequest = (tableId: string) => {
    // Remove this table from the calling list
    const updatedTables = callingTables.filter(id => id !== tableId);
    localStorage.setItem('callingTables', JSON.stringify(updatedTables));
    setCallingTables(updatedTables);
    
    // Show confirmation toast
    toast(`Acknowledged request from Table ${tableId}`);
  };
  
  if (callingTables.length === 0) {
    return (
      <Card className="border-dashed border-gray-300 bg-gray-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-medium text-gray-600">
            <Bell className="mr-2 h-5 w-5 text-gray-400" />
            Assistance Requests
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            No active assistance requests
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="border-red-200 bg-red-50/30 neo-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium text-red-700">
          <BellRing className="mr-2 h-5 w-5 text-red-600 animate-pulse" />
          Assistance Requests
        </CardTitle>
        <CardDescription className="text-sm text-red-600">
          {callingTables.length} table{callingTables.length > 1 ? 's' : ''} requesting assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {callingTables.map((tableId) => (
          <Alert 
            key={tableId} 
            className="bg-red-100/80 border-red-300 neo-blur animate-pulse"
          >
            <AlertTitle className="text-red-700 flex items-center">
              Table {tableId} needs assistance
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between mt-2">
              <span className="text-red-600">Tap to acknowledge</span>
              <Button 
                size="sm" 
                onClick={() => acknowledgeRequest(tableId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Acknowledge
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default TableAssistanceAlerts;
