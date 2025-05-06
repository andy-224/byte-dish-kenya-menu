
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
    <div className="min-h-screen bg-white">
      <div className="bytedish-container">
        <Button 
          variant="ghost" 
          className="p-0 mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Scan Table QR Code</h1>
            <p className="text-gray-600">
              Position the QR code within the frame to identify your table
            </p>
          </div>
          
          <div className="w-64 h-64 border-2 border-bytedish-purple rounded-lg flex items-center justify-center mb-8 relative">
            {scanning ? (
              <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
                <div className="w-full h-1 bg-bytedish-purple absolute animate-pulse"></div>
              </div>
            ) : (
              <QrCode className="w-16 h-16 text-gray-300" />
            )}
          </div>
          
          <Button 
            className="w-full max-w-xs bg-bytedish-purple hover:bg-bytedish-dark-purple"
            onClick={handleStartScan}
            disabled={scanning}
          >
            {scanning ? "Scanning..." : "Start Scanning"}
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
