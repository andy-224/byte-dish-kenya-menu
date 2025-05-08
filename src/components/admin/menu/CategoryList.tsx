
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2, Filter, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  menuItems: any[];
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories,
  menuItems,
  onAddCategory,
  onDeleteCategory
}) => {
  const [newCategory, setNewCategory] = React.useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }
    
    const categoryExists = categories.some(
      cat => cat.name.toLowerCase() === newCategory.toLowerCase()
    );
    
    if (categoryExists) {
      toast({
        title: "Category exists",
        description: "This category already exists",
        variant: "destructive"
      });
      return;
    }
    
    onAddCategory(newCategory);
    setNewCategory("");
  };

  return (
    <div className="neo-blur rounded-xl p-6 border border-white/10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gradient">Menu Categories</h2>
          <p className="text-sm text-gray-400">Organize your menu with categories</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="neo-blur flex-1 md:w-64"
          />
          
          <Button 
            onClick={handleAddCategory}
            className="bg-bytedish-neon-green hover:bg-bytedish-neon-green/90 text-white shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      
      {categories.length > 0 ? (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className="flex items-center justify-between p-3 neo-blur rounded-lg border border-white/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <span>{category.name}</span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteCategory(category.id)}
                className="hover:bg-red-500/20 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Filter className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No categories added yet</p>
          <p className="text-sm text-gray-500 mt-1">Add categories to organize your menu</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
