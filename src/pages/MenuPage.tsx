
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Search, ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import MenuCard from "@/components/menu/MenuCard";
import { mockMenuItems } from "@/data/mockData";

const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks"];

const MenuPage = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { totalItems, setTableId } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockMenuItems);

  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
  }, [tableId, setTableId]);

  useEffect(() => {
    // Filter based on search term and active category
    let filtered = mockMenuItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-bytedish-soft-gray">
      <div className="bytedish-container">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Home
          </Button>
          
          <div className="text-right">
            <h2 className="font-semibold">{tableId?.replace('-', ' ')}</h2>
            <p className="text-xs text-gray-500">ByteDish Restaurant</p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mt-4 mb-4">Our Menu</h1>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search menu..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="mb-4 pb-1">
          <div className="flex space-x-2 py-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-pill ${
                  activeCategory === category ? "active" : "inactive"
                } shrink-0`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="space-y-4 pb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found matching your search</p>
            </div>
          )}
        </div>
        
        {totalItems > 0 && (
          <Button 
            className="cart-button" 
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5 mr-1" />
            View Cart ({totalItems})
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
