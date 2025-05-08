
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus,
  Save, 
  Trash2, 
  Edit, 
  ImagePlus,
  Tag,
  X,
  Check,
  Filter,
  Menu as MenuIcon,
  Copy,
  Upload,
  Image,
  Loader2,
} from "lucide-react";
import { mockMenuItems } from "@/data/mockData";
import { MenuItem } from "@/contexts/CartContext";
import ImageSelector from "@/components/admin/ImageSelector";

interface Category {
  id: string;
  name: string;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    available: true
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load menu items and categories from localStorage on mount
  useEffect(() => {
    const savedMenuItems = localStorage.getItem("bytedish-menu-items");
    const savedCategories = localStorage.getItem("bytedish-categories");
    
    if (savedMenuItems) {
      try {
        setMenuItems(JSON.parse(savedMenuItems));
      } catch (e) {
        console.error("Failed to parse saved menu items:", e);
      }
    } else {
      // Use mock data on first load
      setMenuItems(mockMenuItems);
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Failed to parse saved categories:", e);
      }
    } else {
      // Extract unique categories from mock data
      const uniqueCategories = [...new Set(mockMenuItems.map(item => item.category))];
      const initialCategories = uniqueCategories.map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat
      }));
      setCategories(initialCategories);
    }
  }, []);
  
  // Save menu items to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-menu-items", JSON.stringify(menuItems));
  }, [menuItems]);
  
  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bytedish-categories", JSON.stringify(categories));
  }, [categories]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      available: checked
    }));
  };
  
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };
  
  const addNewMenuItem = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setFormData({
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      category: categories.length > 0 ? categories[0].name : "",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
      available: true
    });
    setIsDialogOpen(true);
  };
  
  const editMenuItem = (item: MenuItem) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setFormData({
      ...item,
      available: item.available !== false // Default to true if not specified
    });
    setIsDialogOpen(true);
  };
  
  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item deleted",
      description: "Menu item has been removed",
    });
  };
  
  const handleSubmitMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditMode && selectedItem) {
      // Update existing item
      setMenuItems(prev => 
        prev.map(item => 
          item.id === selectedItem.id ? formData : item
        )
      );
      toast({
        title: "Item updated",
        description: `${formData.name} has been updated`,
      });
    } else {
      // Add new item
      setMenuItems(prev => [...prev, formData]);
      toast({
        title: "Item added",
        description: `${formData.name} has been added to the menu`,
      });
    }
    
    setIsDialogOpen(false);
  };
  
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
    
    const newCategoryObj = {
      id: newCategory.toLowerCase().replace(/\s+/g, '-'),
      name: newCategory
    };
    
    setCategories(prev => [...prev, newCategoryObj]);
    setNewCategory("");
    toast({
      title: "Category added",
      description: `${newCategory} has been added to categories`,
    });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;
    
    // Check if any menu items use this category
    const itemsUsingCategory = menuItems.filter(
      item => item.category === categoryToDelete.name
    );
    
    if (itemsUsingCategory.length > 0) {
      toast({
        title: "Cannot delete category",
        description: `${categoryToDelete.name} is used by ${itemsUsingCategory.length} menu items`,
        variant: "destructive"
      });
      return;
    }
    
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({
      title: "Category deleted",
      description: `${categoryToDelete.name} has been removed`,
    });
  };
  
  const filteredItems = activeCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => {
        const categoryObj = categories.find(cat => cat.id === activeCategory);
        return categoryObj ? item.category === categoryObj.name : false;
      });
  
  return (
    <AdminLayout title="Menu Management" subtitle="Manage your restaurant menu">
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="neo-blur backdrop-blur-md mb-6">
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu" className="animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`category-pill shrink-0 ${
                  activeCategory === "all" ? "active" : "inactive"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All Items
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-pill shrink-0 ${
                    activeCategory === category.id ? "active" : "inactive"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <Button 
              onClick={addNewMenuItem}
              className="bg-bytedish-neon-green hover:bg-bytedish-neon-green/90 text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="neo-blur rounded-xl overflow-hidden border border-white/10 relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
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
                        onClick={() => editMenuItem(item)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="neo-blur hover:bg-red-500/20 hover:text-red-500"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-blur rounded-xl p-8 text-center">
              <MenuIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No menu items found</p>
              {activeCategory !== "all" && (
                <p className="text-sm text-gray-500 mt-2 mb-4">Try selecting a different category</p>
              )}
              <Button onClick={addNewMenuItem}>Add First Menu Item</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="animate-fade-in">
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
                      onClick={() => handleDeleteCategory(category.id)}
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
        </TabsContent>
      </Tabs>
      
      {/* Menu Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="neo-blur border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">
              {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitMenuItem} className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Chicken Burger"
                className="neo-blur"
                value={formData.name}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onImageSelected={handleImageChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="available">Item is available</Label>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MenuManagement;
