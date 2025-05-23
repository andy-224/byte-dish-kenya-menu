
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Plus, Download, Trash, Printer, ScissorsLineDashed } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import TableStatus from "@/components/admin/TableStatus";

interface Table {
  id: string;
  name: string;
  capacity: number;
  qrLink: string;
}

const TableManagement = () => {
  const [tables, setTables] = useState<Table[]>(() => {
    const savedTables = localStorage.getItem("bytedish-tables");
    return savedTables ? JSON.parse(savedTables) : [];
  });
  
  const [bulkCreateCount, setBulkCreateCount] = useState(1);
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  
  const baseUrl = window.location.origin;

  useEffect(() => {
    // Save tables to localStorage whenever they change
    localStorage.setItem("bytedish-tables", JSON.stringify(tables));
  }, [tables]);

  const handleCreateTable = () => {
    if (!tableName.trim()) {
      toast.error("Please enter a table name");
      return;
    }

    // Create a new table with an incremented ID
    const nextId = tables.length > 0 
      ? String(Math.max(...tables.map(t => parseInt(t.id))) + 1)
      : "1";
      
    const newTable: Table = {
      id: nextId,
      name: tableName.trim(),
      capacity,
      qrLink: `${baseUrl}/menu/${nextId}`,
    };

    setTables([...tables, newTable]);
    setTableName("");
    setCapacity(4);
    toast.success(`Table ${tableName} created successfully`);
  };

  const handleBulkCreateTables = () => {
    if (bulkCreateCount <= 0) {
      toast.error("Please enter a valid number of tables");
      return;
    }

    const currentMaxId = tables.length > 0 
      ? Math.max(...tables.map(t => parseInt(t.id)))
      : 0;

    const newTables: Table[] = [];

    for (let i = 1; i <= bulkCreateCount; i++) {
      const tableId = String(currentMaxId + i);
      newTables.push({
        id: tableId,
        name: `Table ${tableId}`,
        capacity: 4,
        qrLink: `${baseUrl}/menu/${tableId}`,
      });
    }

    setTables([...tables, ...newTables]);
    setBulkCreateCount(1);
    toast.success(`${bulkCreateCount} tables created successfully`);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id));
    if (selectedTable?.id === id) {
      setSelectedTable(null);
    }
    toast.success(`Table deleted successfully`);
  };

  const downloadQR = (table: Table) => {
    // Create a canvas element to draw the QR code
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 250;

    // Fill background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code - Use a different approach to create QR code for download
    // Since QRCodeSVG is a React component, not a constructor
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(table.qrLink)}`;
    
    // Create an image element to load the QR code
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw the QR code image on canvas
      ctx.drawImage(img, 10, 10, 180, 180);
      
      // Add table info text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Table ${table.id}: ${table.name}`, canvas.width / 2, 210);
      
      ctx.font = "12px Arial";
      ctx.fillText("Scan to order", canvas.width / 2, 235);

      // Create download link
      const link = document.createElement("a");
      link.download = `table-${table.id}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    
    // Load the QR code image
    img.src = qrCodeUrl;
  };

  const generatePrintSheet = () => {
    if (tables.length === 0) {
      toast.error("No tables to generate QR sheets");
      return;
    }

    // Create a print-friendly document
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code Print Sheets</title>
        <style>
          @media print {
            @page { margin: 0.5cm; }
            body { font-family: Arial, sans-serif; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 210mm; /* A4 width */
            margin: 0 auto;
            padding: 1cm;
          }
          .header {
            text-align: center;
            margin-bottom: 1cm;
            padding-bottom: 0.5cm;
            border-bottom: 1px solid #ccc;
          }
          .sheet {
            page-break-after: always;
            padding-bottom: 1cm;
          }
          .sheet:last-child {
            page-break-after: avoid;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 1.5cm;
          }
          .qr-item {
            border: 1px dashed #aaa;
            padding: 0.5cm;
            position: relative;
            text-align: center;
          }
          .qr-image {
            width: 100%;
            max-width: 180px;
            height: auto;
            margin: 0 auto;
          }
          .table-name {
            margin-top: 0.5cm;
            font-size: 16pt;
            font-weight: bold;
          }
          .scan-text {
            margin-top: 0.25cm;
            font-size: 9pt;
            color: #555;
          }
          .cut-line {
            position: absolute;
            display: flex;
            align-items: center;
            font-size: 8pt;
            color: #999;
          }
          .cut-line.bottom {
            bottom: -1cm;
            left: 0;
            width: 100%;
            justify-content: center;
          }
          .cut-line.right {
            right: -0.75cm;
            top: 0;
            height: 100%;
            writing-mode: vertical-rl;
            justify-content: center;
          }
          .scissors {
            display: inline-block;
            margin: 0 0.2cm;
          }
          .page-number {
            text-align: center;
            margin-top: 0.5cm;
            font-size: 9pt;
            color: #999;
          }
          .restaurant-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5cm;
          }
          .restaurant-name {
            font-size: 24pt;
            font-weight: bold;
            margin-left: 0.5cm;
          }
          .restaurant-logo {
            width: 2cm;
            height: 2cm;
            background: linear-gradient(135deg, #9b87f5, #6BAAFF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14pt;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="restaurant-brand">
            <div class="restaurant-logo">BD</div>
            <div class="restaurant-name">ByteDish</div>
          </div>
          <div>QR Code Print Sheets - Generated ${new Date().toLocaleDateString()}</div>
        </div>
        ${generateQRSheetHTML(tables)}
      </body>
      </html>
    `;

    // Use an iframe for printing
    if (printFrameRef.current) {
      const iframeDoc = printFrameRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(printContent);
        iframeDoc.close();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printFrameRef.current?.contentWindow?.print();
        }, 1000);
      }
    }
  };

  // Helper function to generate sheet HTML
  const generateQRSheetHTML = (tables: Table[]) => {
    const sheetsHTML = [];
    const tablesPerSheet = 4; // 4 QR codes per sheet
    
    // Calculate number of sheets needed
    const sheetCount = Math.ceil(tables.length / tablesPerSheet);
    
    for (let i = 0; i < sheetCount; i++) {
      const startIdx = i * tablesPerSheet;
      const endIdx = Math.min(startIdx + tablesPerSheet, tables.length);
      const sheetTables = tables.slice(startIdx, endIdx);
      
      sheetsHTML.push(`
        <div class="sheet">
          <div class="qr-grid">
            ${sheetTables.map((table, index) => {
              // Determine if we need bottom and right cut lines
              const isBottomRow = index >= 2;
              const isRightColumn = index % 2 === 0;
              
              return `
                <div class="qr-item">
                  <img class="qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(table.qrLink)}" alt="QR Code for Table ${table.id}" />
                  <div class="table-name">Table ${table.id}: ${table.name}</div>
                  <div class="scan-text">Scan to order</div>
                  ${!isBottomRow ? `
                    <div class="cut-line bottom">
                      <span>✂️</span>
                      <span>- - - - - - - - - - - - - - - - - - - - -</span>
                      <span>✂️</span>
                    </div>
                  ` : ''}
                  ${!isRightColumn ? `
                    <div class="cut-line right">
                      <span>✂️</span>
                      <span>- - - - - - - - - - - - - - - - - - - - -</span>
                      <span>✂️</span>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
          <div class="page-number">Page ${i + 1} of ${sheetCount}</div>
        </div>
      `);
    }
    
    return sheetsHTML.join('');
  };

  return (
    <AdminLayout title="Table Management" subtitle="Manage restaurant tables and QR codes">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-2">
          {/* Bulk Create Tables */}
          <div className="neo-blur p-4 rounded-lg border border-white/10 space-y-4">
            <h3 className="font-semibold">Generate Multiple Tables</h3>
            
            <div className="flex flex-col space-y-4">
              <div>
                <label className="text-sm text-gray-400" htmlFor="bulkCreateCount">
                  Number of Tables to Create
                </label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bulkCreateCount"
                    type="number"
                    min="1"
                    className="neo-blur"
                    value={bulkCreateCount}
                    onChange={(e) => setBulkCreateCount(parseInt(e.target.value) || 1)}
                  />
                  <Button onClick={handleBulkCreateTables} className="bg-primary whitespace-nowrap">
                    <Plus className="mr-1 h-4 w-4" />
                    Generate Tables
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className="neo-blur rounded-lg border border-white/10">
            <div className="bg-black/30 px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gradient">Tables</h2>
              
              <Button 
                onClick={generatePrintSheet} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                disabled={tables.length === 0}
              >
                <Printer className="h-4 w-4" />
                Print QR Sheets
              </Button>
            </div>
            
            {tables.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No tables have been created yet. Add your first table or generate multiple tables.
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {tables.map(table => (
                  <div 
                    key={table.id} 
                    className={`p-4 hover:bg-white/5 flex items-center justify-between ${
                      selectedTable?.id === table.id ? 'bg-white/10' : ''
                    }`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center mr-3 border border-white/10">
                        {table.id}
                      </div>
                      <div>
                        <div className="font-medium">{table.name}</div>
                        <div className="text-xs text-gray-400">Seats {table.capacity}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadQR(table);
                        }}
                        className="text-xs"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        QR
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Create new table */}
          <div className="neo-blur p-4 rounded-lg border border-white/10 space-y-4">
            <h3 className="font-semibold">Create Single Table</h3>
            
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400" htmlFor="tableName">
                    Table Name
                  </label>
                  <Input
                    id="tableName"
                    placeholder="e.g., Window Table"
                    className="neo-blur mt-1"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400" htmlFor="capacity">
                    Capacity
                  </label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    className="neo-blur mt-1"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              
              <Button onClick={handleCreateTable} className="bg-primary">
                <Plus className="mr-1 h-4 w-4" />
                Create Table
              </Button>
            </div>
          </div>
        </div>
        
        {/* Table details sidebar */}
        <div className="space-y-6">
          {selectedTable ? (
            <>
              <div className="neo-blur p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold mb-4">Table {selectedTable.id} Details</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-2 rounded">
                    <QRCodeSVG
                      value={selectedTable.qrLink}
                      size={150}
                      level="H"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div>{selectedTable.name}</div>
                    <div className="text-sm text-gray-400">Seats {selectedTable.capacity}</div>
                  </div>
                  
                  <Button 
                    onClick={() => downloadQR(selectedTable)} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              </div>
              
              <TableStatus tableId={selectedTable.id} />
            </>
          ) : (
            <div className="neo-blur p-6 rounded-lg border border-white/10 text-center text-gray-400">
              Select a table to view details
            </div>
          )}
        </div>
      </div>

      {/* Hidden iframe for printing */}
      <iframe 
        ref={printFrameRef}
        style={{ display: 'none' }} 
        title="Print QR Codes"
      />
    </AdminLayout>
  );
};

export default TableManagement;
