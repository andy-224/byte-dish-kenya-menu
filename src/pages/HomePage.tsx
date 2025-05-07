
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const HomePage = () => {
  const { isAuthenticated } = useCart();

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center relative">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>

      {/* Admin link */}
      <div className="fixed top-6 right-6">
        <Link to={isAuthenticated ? "/admin" : "/admin/login"}>
          <Button variant="ghost" className="hover:bg-white/10">
            <Settings className="h-5 w-5 text-white" />
            <span className="sr-only">Admin Dashboard</span>
          </Button>
        </Link>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-xl animate-fade-in">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-br from-white via-white/90 to-bytedish-purple bg-clip-text text-transparent">
          ByteDish
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Welcome to the future of restaurant dining.
          Scan your table's QR code to get started.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/scan">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 text-white py-6 px-8 rounded-xl shadow-[0_0_15px_rgba(155,135,245,0.5)] hover:shadow-[0_0_25px_rgba(155,135,245,0.7)] transition-all border border-white/10 text-lg font-medium"
            >
              <QrCode className="h-5 w-5 mr-3" /> 
              Scan Table QR
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          ByteDish • Digitizing the dining experience
        </div>
      </div>
    </div>
  );
};

export default HomePage;
