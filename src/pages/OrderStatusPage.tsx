
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, ChefHat, Utensils } from "lucide-react";

type OrderStatus = "received" | "preparing" | "ready" | "complete";

interface OrderStatusInfo {
  stage: OrderStatus;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
}

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("received");

  // Define the order stages
  const orderStages: Record<OrderStatus, OrderStatusInfo> = {
    received: {
      stage: "received",
      title: "Order Received",
      description: "Your order has been received by the kitchen",
      icon: <Clock className="h-12 w-12 text-bytedish-purple" />,
      progress: 25
    },
    preparing: {
      stage: "preparing",
      title: "Preparing Your Order",
      description: "Our chefs are preparing your delicious meal",
      icon: <ChefHat className="h-12 w-12 text-bytedish-purple" />,
      progress: 50
    },
    ready: {
      stage: "ready",
      title: "Order Ready",
      description: "Your order is ready and will be served shortly",
      icon: <Utensils className="h-12 w-12 text-bytedish-purple" />,
      progress: 75
    },
    complete: {
      stage: "complete",
      title: "Order Complete",
      description: "Enjoy your meal! Thank you for using ByteDish",
      icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
      progress: 100
    }
  };

  // Simulate order status progression
  useEffect(() => {
    const statusSequence: OrderStatus[] = [
      "received", 
      "preparing", 
      "ready", 
      "complete"
    ];
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < statusSequence.length - 1) {
        currentIndex++;
        setCurrentStatus(statusSequence[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const statusInfo = orderStages[currentStatus];

  return (
    <div className="min-h-screen bg-bytedish-soft-gray">
      <div className="bytedish-container pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Order Status</h1>
          <p className="text-gray-500">Order #{orderId}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            {statusInfo.icon}
            <h2 className="text-xl font-semibold mt-4 mb-1">{statusInfo.title}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>
          
          <Progress value={statusInfo.progress} className="h-2 mb-6" />
          
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>Received</span>
            <span>Preparing</span>
            <span>Ready</span>
            <span>Complete</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="font-semibold mb-4">Estimated Time</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Preparation time</p>
              <p className="font-medium">15-20 minutes</p>
            </div>
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <Button 
          className="w-full bg-bytedish-purple hover:bg-bytedish-dark-purple"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default OrderStatusPage;
