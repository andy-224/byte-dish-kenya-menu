
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Utensils, 
  ArrowLeft, 
  ClipboardCheck 
} from "lucide-react";

type OrderStatus = "placed" | "received" | "preparing" | "ready" | "served";

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
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("placed");

  // Define the order stages
  const orderStages: Record<OrderStatus, OrderStatusInfo> = {
    placed: {
      stage: "placed",
      title: "Order Placed",
      description: "Your order has been sent to the kitchen",
      icon: <ClipboardCheck className="h-12 w-12 text-primary" />,
      progress: 20
    },
    received: {
      stage: "received",
      title: "Order Received",
      description: "Your order has been received by the kitchen",
      icon: <Clock className="h-12 w-12 text-primary" />,
      progress: 40
    },
    preparing: {
      stage: "preparing",
      title: "Preparing Your Order",
      description: "Our chefs are preparing your delicious meal",
      icon: <ChefHat className="h-12 w-12 text-primary" />,
      progress: 60
    },
    ready: {
      stage: "ready",
      title: "Order Ready",
      description: "Your order is ready and will be served shortly",
      icon: <Utensils className="h-12 w-12 text-primary" />,
      progress: 80
    },
    served: {
      stage: "served",
      title: "Order Served",
      description: "Enjoy your meal! Thank you for using ByteDish",
      icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
      progress: 100
    }
  };

  // Simulate order status progression
  useEffect(() => {
    const statusSequence: OrderStatus[] = [
      "placed", 
      "received", 
      "preparing", 
      "ready", 
      "served"
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
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-md mx-auto px-4 pb-24 pt-6 relative z-10">
        <Button 
          variant="ghost" 
          className="text-white mb-6 p-0 hover:bg-white/10" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
        
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-1 text-gradient">Order Status</h1>
          <p className="text-gray-400">Order #{orderId}</p>
        </div>
        
        <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-6 mb-8 animate-slide-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-primary/40 shadow-[0_0_15px_rgba(155,135,245,0.5)]">
              {statusInfo.icon}
            </div>
            <h2 className="text-2xl font-semibold mt-2 mb-1">{statusInfo.title}</h2>
            <p className="text-gray-300">{statusInfo.description}</p>
            
            {currentStatus === "preparing" && (
              <div className="mt-4 px-4 py-2 bg-white/5 rounded-full text-sm border border-white/10">
                Estimated time: ~15 mins
              </div>
            )}
          </div>
          
          <Progress value={statusInfo.progress} className="h-3 mb-6 bg-white/20" />
          
          <div className="flex justify-between text-xs text-gray-400 px-1">
            {Object.keys(orderStages).map((stage) => (
              <div 
                key={stage} 
                className={`transition-all ${currentStatus === stage ? "text-primary font-medium" : ""}`}
              >
                {stage === "placed" && "Placed"}
                {stage === "received" && "Received"}
                {stage === "preparing" && "Preparing"}
                {stage === "ready" && "Ready"}
                {stage === "served" && "Served"}
              </div>
            ))}
          </div>
        </div>
        
        <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-6 mb-8 animate-slide-in">
          <h3 className="font-semibold mb-4 text-xl">Order Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Table</p>
                <p className="font-medium">Table 14</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="font-semibold">14</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Payment Method</p>
                <p className="font-medium">Cash</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                Pending
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(155,135,245,0.5)] transition-all hover:shadow-[0_0_30px_rgba(155,135,245,0.7)]"
          onClick={() => navigate("/")}
        >
          Return to Menu
        </Button>
      </div>
      
      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
    </div>
  );
};

export default OrderStatusPage;
