
import { useState, useEffect } from "react";
import { MenuItem } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { mockMenuItems } from "@/data/mockData";

interface Category {
  id: string;
  name: string;
}

export const useMenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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
  
  const handleAddCategory = (categoryName: string) => {
    const newCategoryObj = {
      id: categoryName.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName
    };
    
    setCategories(prev => [...prev, newCategoryObj]);
    toast({
      title: "Category added",
      description: `${categoryName} has been added to categories`,
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
  
  const getFilteredItems = () => {
    return activeCategory === "all" 
      ? menuItems 
      : menuItems.filter(item => {
          const categoryObj = categories.find(cat => cat.id === activeCategory);
          return categoryObj ? item.category === categoryObj.name : false;
        });
  };

  return {
    menuItems,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    activeCategory,
    setActiveCategory,
    filteredItems: getFilteredItems(),
    handleInputChange,
    handleSwitchChange,
    handleImageChange,
    addNewMenuItem,
    editMenuItem,
    deleteMenuItem,
    handleSubmitMenuItem,
    handleAddCategory,
    handleDeleteCategory
  };
};
