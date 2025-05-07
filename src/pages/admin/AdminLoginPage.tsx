
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Lock, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminLoginPage = () => {
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const navigate = useNavigate();
  const { checkPinAuth, isAuthenticated } = useCart();
  const { toast } = useToast();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/admin");
    return null;
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
      setPinError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = checkPinAuth(pin);
    
    if (success) {
      toast({
        title: "Authentication successful",
        description: "Welcome to ByteDish Admin Dashboard",
      });
      navigate("/admin");
    } else {
      setPinError(true);
      toast({
        title: "Authentication failed",
        description: "Invalid PIN code",
        variant: "destructive",
      });
    }
  };

  const renderPinDigits = () => {
    const digits = [];
    
    for (let i = 0; i < 4; i++) {
      digits.push(
        <div 
          key={i} 
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold backdrop-blur-xl border ${
            pin[i] ? "bg-primary/20 border-primary" : "bg-black/30 border-white/20"
          } ${pinError ? "border-red-500" : ""}`}
        >
          {pin[i] ? "•" : ""}
        </div>
      );
    }
    
    return digits;
  };

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
      
      <div className="max-w-md mx-auto px-4 pt-12 pb-24 flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="w-full space-y-6 text-center">
          <div className="mb-8 animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-black/40 to-black/10 backdrop-blur-xl flex items-center justify-center border border-primary/30 shadow-[0_0_25px_rgba(155,135,245,0.4)] mb-4">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">ByteDish Admin</h1>
            <p className="text-gray-400 mt-2">Enter your PIN to access the dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="flex justify-center gap-3 mb-6">
                {renderPinDigits()}
              </div>
              
              {pinError && (
                <p className="text-red-500 text-sm mt-2">Invalid PIN. Please try again.</p>
              )}
              
              <Input 
                type="password" 
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]*"
                className="sr-only"
                value={pin}
                onChange={handlePinChange}
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  type="button"
                  className="bg-black/30 hover:bg-primary/20 rounded-xl backdrop-blur-md border border-white/10 text-xl font-medium h-14 w-full"
                  onClick={() => {
                    if (pin.length < 4) {
                      setPin((prev) => prev + number);
                      setPinError(false);
                    }
                  }}
                >
                  {number}
                </Button>
              ))}
              
              <Button
                type="button"
                className="bg-black/30 hover:bg-primary/20 rounded-xl backdrop-blur-md border border-white/10 text-xl font-medium h-14"
                onClick={() => setPin((prev) => prev.slice(0, -1))}
              >
                ←
              </Button>
              
              <Button
                type="button"
                className="bg-black/30 hover:bg-primary/20 rounded-xl backdrop-blur-md border border-white/10 text-xl font-medium h-14"
                onClick={() => {
                  if (pin.length < 4) {
                    setPin((prev) => prev + "0");
                    setPinError(false);
                  }
                }}
              >
                0
              </Button>
              
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 rounded-xl backdrop-blur-md border border-white/10 text-xl font-medium h-14 text-white"
              >
                <Key className="h-6 w-6" />
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>Demo PINs:</p>
            <p>Admin: 1234 | Operator: 5678</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
