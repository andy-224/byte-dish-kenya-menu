
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import AdminLayout from "@/components/admin/AdminLayout";
import TableStatus from "@/components/admin/TableStatus";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const TableStatusDashboard = () => {
  const { tables, updateTableStatus, updateTableNote } = useCart();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTableId, setNewTableId] = useState("");
  
  const handleAddTable = () => {
    if (newTableId.trim()) {
      updateTableStatus(newTableId.trim(), "available");
      setNewTableId("");
      setIsAddDialogOpen(false);
    }
  };

  return (
    <AdminLayout 
      title="Table Status Dashboard" 
      subtitle="Monitor and update the status of all tables in real-time"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gradient">Active Tables</h2>
        <Button 
          size="sm" 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Table
        </Button>
      </div>

      {tables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <TableStatus
              key={table.id}
              tableId={table.id}
              onStatusUpdate={updateTableStatus}
              onNoteUpdate={updateTableNote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-500 rounded-lg">
          <p className="text-gray-400 mb-4">No tables have been added yet</p>
          <Button 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Your First Table
          </Button>
        </div>
      )}

      {/* Add Table Dialog */}
      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent className="neo-blur border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Table</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a table identifier (number or name)
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Input
              type="text"
              placeholder="e.g. Table 1, Patio 2, etc."
              className="neo-blur"
              value={newTableId}
              onChange={(e) => setNewTableId(e.target.value)}
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddTable}
            >
              Add Table
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default TableStatusDashboard;
