
import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

const CallAssistanceButton = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { tableId } = useCart();
  const { toast } = useToast();
  
  const requestAssistance = () => {
    if (cooldown || !tableId) return;
    
    setIsRequesting(true);
    
    // For demo purposes, we're just simulating an API call
    // In a real app, this would be a call to your backend
    setTimeout(() => {
      // Add the table to "calling tables" in localStorage for demo
      const callingTables = JSON.parse(localStorage.getItem('callingTables') || '[]');
      if (!callingTables.includes(tableId)) {
        callingTables.push(tableId);
        localStorage.setItem('callingTables', JSON.stringify(callingTables));
      }
      
      setIsRequesting(false);
      setCooldown(true);
      
      toast({
        title: "Assistance Requested",
        description: "A staff member will be with you shortly.",
      });
      
      // Set a 30-second cooldown
      setTimeout(() => {
        setCooldown(false);
      }, 30000);
    }, 1000);
  };
  
  return (
    <Button 
      onClick={requestAssistance}
      disabled={isRequesting || cooldown}
      className={`fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg ${
        cooldown ? "bg-gray-500" : "bg-primary animate-pulse"
      }`}
      aria-label="Request assistance"
    >
      <PhoneCall className="h-6 w-6" />
    </Button>
  );
};

export default CallAssistanceButton;
