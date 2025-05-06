
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const QRScanPage = () => {
  const navigate = useNavigate();
  const { setTableId } = useCart();
  const [scanning, setScanning] = useState(false);

  // In a real app, this would use the device's camera to scan a QR code
  // For this demo, we'll simulate scanning after a delay
  const handleStartScan = () => {
    setScanning(true);
    
    // Simulate successful scan after 2 seconds
    setTimeout(() => {
      const mockTableId = "table-" + Math.floor(Math.random() * 20 + 1);
      setTableId(mockTableId);
      navigate(`/menu/${mockTableId}`);
    }, 2000);
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
      
      <div className="bytedish-container animate-fade-in">
        <Button 
          variant="ghost" 
          className="p-0 mb-6 hover:bg-white/10" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-gradient">Back</span>
        </Button>
        
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gradient mb-3">Scan Table QR Code</h1>
            <p className="text-gray-400">
              Position the QR code within the frame to identify your table
            </p>
          </div>
          
          <div className="w-64 h-64 border-2 border-primary rounded-lg flex items-center justify-center mb-8 relative neo-blur">
            {scanning ? (
              <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-full h-1 bg-primary absolute animate-pulse shadow-[0_0_10px_rgba(155,135,245,0.7)]"></div>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-primary/50 rounded-lg animate-pulse"></div>
              </div>
            ) : (
              <QrCode className="w-20 h-20 text-primary/50" />
            )}
            
            {/* Scan corners for effect */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary"></div>
          </div>
          
          <Button 
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(155,135,245,0.5)] hover:shadow-[0_0_25px_rgba(155,135,245,0.7)] transition-all rounded-xl border border-white/10"
            onClick={handleStartScan}
            disabled={scanning}
          >
            {scanning ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                Scanning...
              </span>
            ) : (
              "Start Scanning"
            )}
          </Button>
          
          <p className="mt-8 text-sm text-gray-500">
            For demo purposes, this will simulate a successful scan
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanPage;
