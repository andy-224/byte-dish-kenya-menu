
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ShiftTimer from "@/components/admin/ShiftTimer";
import RealTimeQueueView from "@/components/admin/RealTimeQueueView";
import TableAssistanceAlerts from "@/components/admin/TableAssistanceAlerts";
import ServiceIssueLog from "@/components/admin/ServiceIssueLog";
import { MessageSquare, Grid, Clock, FileText } from "lucide-react";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-gradient">Operator Dashboard</h1>
            <p className="text-gray-400">Manage orders, tables, and customer requests</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ShiftTimer />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Button 
            className="p-6 h-auto neo-blur flex flex-col items-center text-left"
            onClick={() => navigate("/admin/orders")}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Orders</h3>
            <p className="text-sm text-gray-400 mt-1">Manage active orders</p>
          </Button>
          
          <Button 
            className="p-6 h-auto neo-blur flex flex-col items-center text-left"
            onClick={() => navigate("/admin/tables")}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Grid className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Tables</h3>
            <p className="text-sm text-gray-400 mt-1">View and manage tables</p>
          </Button>
          
          <Button 
            className="p-6 h-auto neo-blur flex flex-col items-center text-left"
            onClick={() => navigate("/admin/table-status")}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Table Status</h3>
            <p className="text-sm text-gray-400 mt-1">Track table status in real-time</p>
          </Button>
          
          <Button 
            className="p-6 h-auto neo-blur flex flex-col items-center text-left"
            onClick={() => navigate("/admin/feedback")}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Feedback</h3>
            <p className="text-sm text-gray-400 mt-1">View customer feedback</p>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TableAssistanceAlerts />
          </div>
          <div>
            <RealTimeQueueView />
          </div>
        </div>
        
        <div className="mt-6">
          <ServiceIssueLog />
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
