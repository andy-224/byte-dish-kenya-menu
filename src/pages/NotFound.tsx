
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex items-center justify-center">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>
      
      <div className="text-center p-6 max-w-md neo-blur rounded-2xl border border-white/10 backdrop-blur-xl animate-fade-in">
        <h1 className="text-8xl font-bold mb-4 text-gradient">404</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-xl text-gray-300 mb-8">Oops! This page is not on the menu</p>
        <Button 
          className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 flex items-center gap-2 px-6 py-5 rounded-xl shadow-[0_0_15px_rgba(155,135,245,0.5)] hover:shadow-[0_0_25px_rgba(155,135,245,0.7)] transition-all border border-white/10"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
