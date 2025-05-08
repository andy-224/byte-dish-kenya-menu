
import { useState } from "react";
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

const OperatorDashboard = () => {
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
