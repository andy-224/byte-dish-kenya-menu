import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, QrCode, Printer, Save, Edit, Check, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/contexts/CartContext";

interface TableItem {
  id: number;
  name: string;
}

const TableManagement = () => {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [totalTables, setTotalTables] = useState<number>(0);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const { userRole } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const baseUrl = window.location.origin;

  // Load tables from localStorage on mount
  useEffect(() => {
    const savedTables = localStorage.getItem("bytedish-tables");
    if (savedTables) {
      try {
        setTables(JSON.parse(savedTables));
      } catch (e) {
        console.error("Failed to parse saved tables:", e);
      }
    }
  }, []);

  // Save tables to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-tables", JSON.stringify(tables));
  }, [tables]);

  // Generate tables based on input
  const generateTables = () => {
    if (totalTables <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of tables",
        variant: "destructive",
      });
      return;
    }

    const newTables: TableItem[] = [];
    for (let i = 1; i <= totalTables; i++) {
      newTables.push({ id: i, name: `Table ${i}` });
    }
    
    setTables(newTables);
    toast({
      title: "Tables generated",
      description: `${totalTables} tables have been generated with QR codes`,
    });
  };

  const deleteTable = (id: number) => {
    setTables(tables.filter(table => table.id !== id));
    toast({
      title: "Table deleted",
      description: `Table ${id} has been removed`,
    });
  };

  const startEditingTable = (table: TableItem) => {
    setSelectedTable(table.id);
    setNewTableName(table.name);
    setIsEditing(true);
  };

  const saveTableEdit = (id: number) => {
    setTables(tables.map(table => 
      table.id === id ? { ...table, name: newTableName || table.name } : table
    ));
    setIsEditing(false);
    setSelectedTable(null);
    toast({
      title: "Table updated",
      description: `Table name has been updated`,
    });
  };

  const cancelEditingTable = () => {
    setIsEditing(false);
    setSelectedTable(null);
  };

  const addNewTable = () => {
    const maxId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) : 0;
    const newTable = {
      id: maxId + 1,
      name: `Table ${maxId + 1}`
    };
    setTables([...tables, newTable]);
    toast({
      title: "Table added",
      description: `${newTable.name} has been added`,
    });
  };

  const getQRCodeUrl = (tableId: number) => {
    return `${baseUrl}/menu/table-${tableId}`;
  };

  // Generate PDF with QR codes for printing
  const generatePrintSheet = () => {
    // In a real implementation, this would generate a PDF
    // For our demo, we'll just show a success message
    toast({
      title: "Print sheet generated",
      description: "QR code print sheet has been generated and ready for printing",
    });
  };

  return (
    <AdminLayout title="Table Management" subtitle="Configure and manage tables">
      {userRole === "admin" ? (
        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="neo-blur backdrop-blur-md mb-6">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
            <TabsTrigger value="print">Print Sheets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4 items-center">
                <Input
                  type="number"
                  placeholder="Number of tables"
                  min={1}
                  className="neo-blur w-40"
                  value={totalTables || ""}
                  onChange={(e) => setTotalTables(parseInt(e.target.value) || 0)}
                />
                <Button 
                  onClick={generateTables}
                  className="bg-primary hover:bg-primary/90"
                >
                  Generate Tables
                </Button>
              </div>
              
              <Button onClick={addNewTable} className="bg-bytedish-neon-green hover:bg-bytedish-neon-green/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </div>
            
            <div className="neo-blur rounded-xl overflow-hidden">
              {tables.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black/30 hover:bg-transparent border-white/10">
                      <TableHead className="text-white">ID</TableHead>
                      <TableHead className="text-white">Table Name</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables.map((table) => (
                      <TableRow 
                        key={table.id} 
                        className="hover:bg-white/5 border-white/10"
                      >
                        <TableCell className="font-medium">{table.id}</TableCell>
                        <TableCell>
                          {isEditing && selectedTable === table.id ? (
                            <Input
                              className="neo-blur w-full"
                              value={newTableName}
                              onChange={(e) => setNewTableName(e.target.value)}
                              autoFocus
                            />
                          ) : (
                            table.name
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing && selectedTable === table.id ? (
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-bytedish-neon-green/20 hover:text-bytedish-neon-green"
                                onClick={() => saveTableEdit(table.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-red-500/20 hover:text-red-500"
                                onClick={cancelEditingTable}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-white/10"
                                onClick={() => startEditingTable(table)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="hover:bg-red-500/20 hover:text-red-500"
                                onClick={() => deleteTable(table.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <QrCodeSVG className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No tables configured</p>
                  <p className="text-sm text-gray-500">Generate tables to get started</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="qrcodes" className="animate-fade-in">
            {tables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => (
                  <div 
                    key={table.id} 
                    className="neo-blur rounded-xl p-6 flex flex-col items-center border border-white/10"
                  >
                    <div className="p-4 bg-white rounded-xl mb-4">
                      <QRCodeSVG value={getQRCodeUrl(table.id)} size={150} level="H" includeMargin={true} />
                    </div>
                    <h3 className="font-semibold text-lg text-gradient mb-1">{table.name}</h3>
                    <p className="text-xs text-gray-400 mb-4">{getQRCodeUrl(table.id)}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs neo-blur"
                        onClick={() => {
                          // In a real app, this would download the QR code
                          toast({
                            title: "QR Code downloaded",
                            description: `${table.name} QR code has been downloaded`,
                          });
                        }}
                      >
                        <Save className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="neo-blur rounded-xl p-8 text-center">
                <QrCodeSVG className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No QR codes available</p>
                <p className="text-sm text-gray-500 mb-4">Generate tables first to create QR codes</p>
                <Button onClick={() => navigate("/admin/tables")}>
                  Generate Tables
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="print" className="animate-fade-in">
            <div className="neo-blur rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gradient">QR Code Print Sheets</h2>
                  <p className="text-sm text-gray-400">Generate printable sheets with QR codes</p>
                </div>
                <Button 
                  onClick={generatePrintSheet}
                  className="bg-bytedish-neon-blue hover:bg-bytedish-neon-blue/90 text-white"
                  disabled={tables.length === 0}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Generate Print Sheet
                </Button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Print Sheet Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Sheet Layout</label>
                    <select className="neo-blur w-full py-2 px-3 rounded-md">
                      <option value="2x2">2x2 (4 QR codes per sheet)</option>
                      <option value="3x3">3x3 (9 QR codes per sheet)</option>
                      <option value="4x4">4x4 (16 QR codes per sheet)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Paper Size</label>
                    <select className="neo-blur w-full py-2 px-3 rounded-md">
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {tables.length > 0 ? (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Print Preview</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="aspect-[1/1.414] bg-white rounded relative overflow-hidden">
                      <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-4">
                        {[0, 1, 2, 3].map(i => {
                          const tableIndex = i < tables.length ? i : i % tables.length;
                          return (
                            <div key={i} className="flex flex-col items-center border border-dashed border-gray-300 p-4 relative">
                              <div className="absolute inset-x-0 top-0 border-b border-dashed border-gray-300 text-xs text-gray-400 text-center p-1">
                                Cut here
                              </div>
                              <div className="mb-2 mt-4">
                                <QRCodeSVG value={getQRCodeUrl(tables[tableIndex].id)} size={70} level="H" includeMargin={false} />
                              </div>
                              <div className="text-xs text-center font-bold text-gray-800">
                                {tables[tableIndex].name}
                              </div>
                              <div className="text-[8px] text-center text-gray-500">
                                ByteDish Restaurant
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-400">
                    Note: This is a conceptual preview. In a real app, this would generate a downloadable PDF.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCodeSVG className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No tables available for print sheets</p>
                  <p className="text-sm text-gray-500 mb-4">Generate tables first</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="neo-blur rounded-xl p-8 text-center">
          <p className="text-gray-400">You don't have permission to access this page</p>
          <p className="text-sm text-gray-500 mb-4">Only admin users can manage tables</p>
          <Button onClick={() => navigate("/admin")}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default TableManagement;
