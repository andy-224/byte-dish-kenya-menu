
import React from "react";
import { MenuItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="neo-blur rounded-xl overflow-hidden border border-white/10 relative group">
      <div className="aspect-video relative">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
          KES {item.price.toLocaleString()}
        </div>
        {item.available === false && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="px-3 py-1 bg-red-500/20 text-red-500 font-medium rounded-full text-sm">
              Not Available
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-gradient">{item.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2 h-10 mb-1">{item.description}</p>
          <span className="text-xs bg-primary/20 text-white/80 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline"
            className="neo-blur flex-1"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="neo-blur hover:bg-red-500/20 hover:text-red-500"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
