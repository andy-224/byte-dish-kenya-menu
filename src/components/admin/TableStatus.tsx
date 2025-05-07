
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Clock,
  Tag,
  FileText,
  Sparkles,
  Calendar,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";

type TableStatusType = "available" | "occupied" | "reserved" | "needs-cleaning";
type TableNote = "waiting-for-bill" | "vip" | "special-request" | "reservation";

interface TableStatusProps {
  tableId: string;
  onStatusUpdate?: (tableId: string, status: TableStatusType) => void;
  onNoteUpdate?: (tableId: string, note: TableNote | null) => void;
}

const TableStatus = ({
  tableId,
  onStatusUpdate,
  onNoteUpdate,
}: TableStatusProps) => {
  const [status, setStatus] = useState<TableStatusType>("available");
  const [note, setNote] = useState<TableNote | null>(null);

  const handleStatusChange = (newStatus: TableStatusType) => {
    setStatus(newStatus);
    if (onStatusUpdate) {
      onStatusUpdate(tableId, newStatus);
    }
    toast.success(`Table ${tableId} marked as ${newStatus}`);
  };

  const handleNoteChange = (newNote: TableNote | null) => {
    // If clicking on the current note, toggle it off
    if (note === newNote) {
      setNote(null);
      if (onNoteUpdate) {
        onNoteUpdate(tableId, null);
      }
    } else {
      setNote(newNote);
      if (onNoteUpdate) {
        onNoteUpdate(tableId, newNote);
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg neo-blur border border-white/10">
      <h3 className="font-semibold">Table {tableId} Status</h3>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={status === "available" ? "default" : "outline"}
          className={status === "available" ? "bg-green-600" : ""}
          onClick={() => handleStatusChange("available")}
          size="sm"
        >
          <Check className="mr-1 h-4 w-4" />
          Available
        </Button>

        <Button
          variant={status === "occupied" ? "default" : "outline"}
          className={status === "occupied" ? "bg-blue-600" : ""}
          onClick={() => handleStatusChange("occupied")}
          size="sm"
        >
          <Clock className="mr-1 h-4 w-4" />
          Occupied
        </Button>

        <Button
          variant={status === "reserved" ? "default" : "outline"}
          className={status === "reserved" ? "bg-orange-600" : ""}
          onClick={() => handleStatusChange("reserved")}
          size="sm"
        >
          <Calendar className="mr-1 h-4 w-4" />
          Reserved
        </Button>

        <Button
          variant={status === "needs-cleaning" ? "default" : "outline"}
          className={status === "needs-cleaning" ? "bg-red-600" : ""}
          onClick={() => handleStatusChange("needs-cleaning")}
          size="sm"
        >
          <Sparkles className="mr-1 h-4 w-4" />
          Needs Cleaning
        </Button>
      </div>

      <div className="pt-2 border-t border-white/10">
        <h4 className="text-sm text-gray-400 mb-2">Table Notes</h4>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={note === "waiting-for-bill" ? "default" : "outline"}
            className={note === "waiting-for-bill" ? "bg-amber-600" : ""}
            onClick={() => handleNoteChange("waiting-for-bill")}
            size="sm"
          >
            <FileText className="mr-1 h-4 w-4" />
            Waiting for Bill
          </Button>

          <Button
            variant={note === "vip" ? "default" : "outline"}
            className={note === "vip" ? "bg-purple-600" : ""}
            onClick={() => handleNoteChange("vip")}
            size="sm"
          >
            <Tag className="mr-1 h-4 w-4" />
            VIP
          </Button>

          <Button
            variant={note === "special-request" ? "default" : "outline"}
            className={note === "special-request" ? "bg-cyan-600" : ""}
            onClick={() => handleNoteChange("special-request")}
            size="sm"
          >
            <BellRing className="mr-1 h-4 w-4" />
            Special Request
          </Button>

          <Button
            variant={note === "reservation" ? "default" : "outline"}
            className={note === "reservation" ? "bg-indigo-600" : ""}
            onClick={() => handleNoteChange("reservation")}
            size="sm"
          >
            <Calendar className="mr-1 h-4 w-4" />
            Reservation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableStatus;
