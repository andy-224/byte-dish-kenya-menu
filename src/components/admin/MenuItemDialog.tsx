import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { ImageSelector } from "@/components/admin/image-selector";
import { MenuItem } from "@/contexts/CartContext";

interface Category {
  id: string;
  name: string;
}

interface MenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  formData: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
  };
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onImageChange: (imageUrl: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  isOpen,
  onOpenChange,
  isEditMode,
  formData,
  categories,
  onInputChange,
  onSwitchChange,
  onImageChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="neo-blur border-white/10 max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-gradient">
            {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-130px)] pr-4">
          <form onSubmit={onSubmit} className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Chicken Burger"
                className="neo-blur"
                value={formData.name}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the menu item..."
                className="neo-blur resize-none"
                value={formData.description}
                onChange={onInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="any"
                  className="neo-blur"
                  value={formData.price}
                  onChange={onInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="neo-blur w-full h-9 rounded-md px-3"
                  value={formData.category}
                  onChange={onInputChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Item Image</Label>
              <ImageSelector 
                currentImage={formData.image}
                onImageSelected={onImageChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={onSwitchChange}
              />
              <Label htmlFor="available">Item is available</Label>
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="pt-4 sticky bottom-0">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-primary hover:bg-primary/90"
            onClick={onSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
