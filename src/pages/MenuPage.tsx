
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import MenuCard from "@/components/menu/MenuCard";
import { mockMenuItems } from "@/data/mockData";
import { toast } from "sonner";

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
      // Store tableId in localStorage to use in cart
      localStorage.setItem("currentTableId", tableId);
      setTableId(tableId);
      toast.success(`Menu loaded for ${tableId.replace('-', ' ')}`);
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[30%] left-[15%] w-40 h-40 rounded-full bg-bytedish-neon-blue/10 blur-[120px] animate-pulse"></div>
      
      {/* Floating decoration elements */}
      <div className="fixed top-[15%] right-[25%] w-2 h-2 rounded-full bg-bytedish-neon-pink shadow-[0_0_15px_5px_rgba(255,107,246,0.3)] animate-float-slow"></div>
      <div className="fixed bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-bytedish-neon-green shadow-[0_0_15px_8px_rgba(107,255,139,0.2)] animate-float-med"></div>
      <div className="fixed top-[45%] left-[15%] w-2 h-2 rounded-full bg-bytedish-neon-blue shadow-[0_0_15px_5px_rgba(107,170,255,0.3)] animate-float-fast"></div>
      
      <div className="bytedish-container animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 hover:bg-white/10" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-gradient">Home</span>
          </Button>
          
          <div className="text-right">
            <h2 className="font-semibold text-gradient">{tableId?.replace('-', ' ')}</h2>
            <p className="text-xs text-gray-400">ByteDish Restaurant</p>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mt-4 mb-6 text-gradient">Our Menu</h1>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search menu..." 
            className="pl-9 glass-morphism bg-transparent border-white/10 focus:border-primary/50 text-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="mb-6 pb-2">
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
        
        <div className="space-y-5 pb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MenuCard 
                key={item.id} 
                item={item} 
                className={`animate-slide-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            <div className="text-center py-8 neo-blur rounded-xl animate-fade-in">
              <p className="text-gray-300">No items found matching your search</p>
            </div>
          )}
        </div>
        
        {totalItems > 0 && (
          <Button 
            className="cart-button animate-pulse-glow" 
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
