
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square, FileText } from "lucide-react";

interface ShiftState {
  isActive: boolean;
  startTime: string | null;
  endTime: string | null;
  duration: number; // in seconds
}

const ShiftTimer = () => {
  const [shift, setShift] = useState<ShiftState>(() => {
    const savedShift = localStorage.getItem("bytedish-shift-timer");
    if (savedShift) {
      const parsedShift = JSON.parse(savedShift);
      return {
        ...parsedShift,
        // If a shift was active when the page was closed, continue from where we left off
        duration: parsedShift.isActive
          ? parsedShift.duration + (parsedShift.startTime
            ? (Date.now() - new Date(parsedShift.startTime).getTime()) / 1000
            : 0)
          : parsedShift.duration
      };
    }
    return {
      isActive: false,
      startTime: null,
      endTime: null,
      duration: 0,
    };
  });

  const [elapsedTime, setElapsedTime] = useState(shift.duration);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (shift.isActive) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shift.isActive]);

  useEffect(() => {
    // Save shift state to localStorage
    localStorage.setItem("bytedish-shift-timer", JSON.stringify(shift));
  }, [shift]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startShift = () => {
    const now = new Date();
    setShift({
      isActive: true,
      startTime: now.toISOString(),
      endTime: null,
      duration: 0,
    });
    setElapsedTime(0);
  };

  const endShift = () => {
    const now = new Date();
    setShift(prevShift => ({
      ...prevShift,
      isActive: false,
      endTime: now.toISOString(),
      duration: elapsedTime,
    }));
  };

  const exportShiftData = () => {
    if (!shift.startTime) return;
    
    const startDate = new Date(shift.startTime);
    const endDate = shift.endTime ? new Date(shift.endTime) : new Date();
    
    const shiftData = {
      startTime: startDate.toLocaleString(),
      endTime: shift.endTime ? endDate.toLocaleString() : "Still active",
      duration: formatTime(elapsedTime),
    };
    
    // In a real app, this would export to CSV or PDF
    alert(`Shift Data:\n\nStart: ${shiftData.startTime}\nEnd: ${shiftData.endTime}\nDuration: ${shiftData.duration}`);
  };

  return (
    <div className="neo-blur p-4 rounded-lg border border-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Shift Timer
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportShiftData}
            className="text-xs neo-blur"
            disabled={!shift.startTime}
          >
            <FileText className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
        
        <div className="bg-black/20 rounded-lg p-6 text-center">
          <div className="text-3xl font-mono font-bold text-gradient">
            {formatTime(elapsedTime)}
          </div>
          
          <div className="text-xs text-gray-400 mt-1">
            {shift.startTime && (
              <>
                Started at {new Date(shift.startTime).toLocaleString()}
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 pt-2">
          {!shift.isActive ? (
            <Button 
              onClick={startShift}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="mr-1 h-4 w-4" />
              Start Shift
            </Button>
          ) : (
            <Button 
              onClick={endShift}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="mr-1 h-4 w-4" />
              End Shift
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftTimer;
