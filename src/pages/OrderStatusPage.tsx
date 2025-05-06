
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
  ClipboardCheck,
  Home
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
  const [glowingIndex, setGlowingIndex] = useState(0);

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

  // Floating glow effect for step indicators
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowingIndex(prev => (prev + 1) % Object.keys(orderStages).length);
    }, 2000);
    
    return () => clearInterval(glowInterval);
  }, []);

  const statusInfo = orderStages[currentStatus];
  const statusKeys = Object.keys(orderStages) as OrderStatus[];
  const currentStatusIndex = statusKeys.findIndex(key => key === currentStatus);

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>
      
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
          <p className="text-gray-400">Order #{orderId?.replace('order-', '')}</p>
        </div>
        
        {/* Status card with enhanced glassmorphism */}
        <div className="neo-blur rounded-xl p-6 mb-8 animate-slide-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-black/40 to-black/10 backdrop-blur-xl flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_25px_rgba(155,135,245,0.4)]">
              {statusInfo.icon}
            </div>
            <h2 className="text-2xl font-bold mt-3 mb-1 text-gradient">{statusInfo.title}</h2>
            <p className="text-gray-300">{statusInfo.description}</p>
            
            {currentStatus === "preparing" && (
              <div className="mt-4 px-6 py-3 neo-blur rounded-full text-sm border border-white/5 animate-pulse-glow">
                <span className="text-gradient-primary font-medium">Estimated time: ~15 mins</span>
              </div>
            )}
          </div>
          
          {/* Enhanced progress bar */}
          <div className="relative mb-8">
            <Progress value={statusInfo.progress} className="h-3 backdrop-blur-md bg-white/5 border border-white/10" />
            <div className="absolute -top-1 left-0 h-5 w-5 rounded-full bg-primary shadow-[0_0_15px_rgba(155,135,245,0.7)] border-2 border-background" style={{ left: `${statusInfo.progress}%`, transform: 'translateX(-50%)' }}></div>
          </div>
          
          {/* Enhanced status indicators */}
          <div className="flex justify-between relative">
            {statusKeys.map((stage, index) => {
              const isActive = currentStatusIndex >= index;
              const isGlowing = glowingIndex === index;
              
              return (
                <div 
                  key={stage} 
                  className={`flex flex-col items-center transition-all ${isActive ? "opacity-100" : "opacity-50"}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      isActive 
                        ? isGlowing 
                          ? "bg-primary shadow-[0_0_15px_rgba(155,135,245,0.8)]" 
                          : "bg-primary/80" 
                        : "bg-white/20"
                    }`}
                  >
                    {index < currentStatusIndex ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : index === currentStatusIndex ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    )}
                  </div>
                  <span className={`text-xs ${
                    isActive 
                      ? "text-white font-medium" 
                      : "text-gray-400"
                  }`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </span>
                </div>
              );
            })}
            
            {/* Connecting line behind the indicators */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 -z-10"></div>
            <div 
              className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500" 
              style={{ width: `${(currentStatusIndex / (statusKeys.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Order details with enhanced glassmorphism */}
        <div className="neo-blur rounded-xl p-6 mb-8 animate-slide-in">
          <h3 className="font-bold mb-4 text-xl text-gradient">Order Details</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Table</p>
                <p className="font-medium text-white">Table 14</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="font-bold text-gradient">14</span>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                <p className="font-medium text-white">Cash</p>
              </div>
              <div className="px-4 py-2 rounded-full neo-blur text-bytedish-neon-blue text-sm font-medium border border-bytedish-neon-blue/20 shadow-[0_0_10px_rgba(107,170,255,0.3)]">
                Pending
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced button */}
        <div className="flex gap-4">
          <Button 
            className="flex-1 py-6 bg-gradient-to-br from-primary to-primary/80 hover:bg-primary/90 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(155,135,245,0.4)] transition-all hover:shadow-[0_0_30px_rgba(155,135,245,0.7)] border border-white/10"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
