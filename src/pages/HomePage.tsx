
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Utensils, ShoppingBag } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bytedish-soft-gray">
      <div className="bytedish-container pt-12">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 rounded-full bg-bytedish-purple flex items-center justify-center mb-6 animate-fade-in">
            <Utensils className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-bytedish-dark animate-fade-in">ByteDish</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in">Digital Menu & Ordering</p>
          
          <div className="space-y-4 w-full max-w-xs animate-fade-in">
            <Button 
              className="w-full py-6 text-lg bg-bytedish-purple hover:bg-bytedish-dark-purple flex items-center justify-center gap-3"
              onClick={() => navigate("/scan")}
            >
              <QrCode className="w-5 h-5" />
              Scan Table QR
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 text-lg border-bytedish-purple text-bytedish-purple hover:bg-bytedish-soft-gray flex items-center justify-center gap-3"
              onClick={() => navigate("/menu/demo")}
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Demo Menu
            </Button>
          </div>
          
          <p className="mt-12 text-sm text-gray-500">
            Experience the future of restaurant ordering
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
