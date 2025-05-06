
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Utensils, ShoppingBag } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>
      
      <div className="bytedish-container pt-12">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 rounded-full neo-blur flex items-center justify-center mb-8 animate-fade-in">
            <Utensils className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-3 text-gradient animate-fade-in">ByteDish</h1>
          <p className="text-xl text-gray-400 mb-12 animate-fade-in">Digital Menu & Ordering</p>
          
          <div className="space-y-6 w-full max-w-xs animate-slide-in">
            <Button 
              className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-3 rounded-xl shadow-[0_0_15px_rgba(155,135,245,0.5)] transition-all hover:shadow-[0_0_25px_rgba(155,135,245,0.7)] border border-white/10"
              onClick={() => navigate("/scan")}
            >
              <QrCode className="w-5 h-5" />
              Scan Table QR
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 text-lg border-primary text-primary hover:bg-primary/20 flex items-center justify-center gap-3 rounded-xl neo-blur"
              onClick={() => navigate("/menu/demo")}
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Demo Menu
            </Button>
          </div>
          
          <p className="mt-12 text-sm text-gray-500 animate-fade-in">
            Experience the future of restaurant ordering
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
