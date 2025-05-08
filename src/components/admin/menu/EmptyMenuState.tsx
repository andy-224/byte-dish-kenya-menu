
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";

interface EmptyMenuStateProps {
  activeCategory: string;
  onAddItem: () => void;
}

const EmptyMenuState: React.FC<EmptyMenuStateProps> = ({ activeCategory, onAddItem }) => {
  return (
    <div className="neo-blur rounded-xl p-8 text-center">
      <MenuIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
      <p className="text-gray-400">No menu items found</p>
      {activeCategory !== "all" && (
        <p className="text-sm text-gray-500 mt-2 mb-4">Try selecting a different category</p>
      )}
      <Button onClick={onAddItem}>Add First Menu Item</Button>
    </div>
  );
};

export default EmptyMenuState;
