
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import AdminLayout from "@/components/admin/AdminLayout";
import RealTimeQueueView from "@/components/admin/RealTimeQueueView";
import ShiftTimer from "@/components/admin/ShiftTimer";
import ServiceIssueLog from "@/components/admin/ServiceIssueLog";
import OrderExport from "@/components/admin/OrderExport";
import TableAssistanceAlerts from "@/components/admin/TableAssistanceAlerts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OperatorDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <AdminLayout title="Operator Dashboard" subtitle="Manage orders and operations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <TableAssistanceAlerts />
          </div>
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="neo-blur bg-black/20">
              <TabsTrigger value="queue">Queue</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
            
            <TabsContent value="queue" className="space-y-6">
              <RealTimeQueueView />
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-6">
              <ServiceIssueLog />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="neo-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Menu Management</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80 hover:bg-white/5"
                  onClick={() => navigate('/admin/menu')}
                >
                  Manage Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Update menu items, add new dishes, or manage item availability.
              </p>
            </div>
            
            <div className="neo-blur rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Table Status</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80 hover:bg-white/5"
                  onClick={() => navigate('/admin/table-status')}
                >
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Monitor and update table statuses in real-time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <ShiftTimer />
          <OrderExport />
        </div>
      </div>
    </AdminLayout>
  );
};

export default OperatorDashboard;
