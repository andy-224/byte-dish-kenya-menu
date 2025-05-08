
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import MenuCard from "@/components/menu/MenuCard";
import { mockMenuItems } from "@/data/mockData"; 
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import RepeatOrderOption from "@/components/RepeatOrderOption";
import CallAssistanceButton from "@/components/menu/CallAssistanceButton";

const MenuPage = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setTableId } = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  
  // Save the tableId when component mounts
  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
      localStorage.setItem("currentTableId", tableId);
    }
  }, [tableId, setTableId]);
  
  // Extract unique categories from menuItems
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(mockMenuItems.map((item) => item.category))
    ) as string[]; // Add type assertion to fix the unknown[] issue
    setCategories(uniqueCategories);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Our Menu</h1>
        <p className="text-gray-400">
          Table {tableId} • Order directly from your phone
        </p>
      </div>
      
      {/* Add the RepeatOrderOption component here */}
      {tableId && <RepeatOrderOption tableId={tableId} />}
      
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="flex items-center w-full overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm md:text-base"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockMenuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="fixed bottom-4 right-4">
        <Button
          className="neo-blur bg-primary"
          size="lg"
          onClick={() => window.location.href = "/cart"}
        >
          View Cart
        </Button>
      </div>
      
      {/* Add the call assistance button */}
      <CallAssistanceButton />
    </div>
  );
};

export default MenuPage;
