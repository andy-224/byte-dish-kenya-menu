
import { useState, useEffect } from "react";
import { useCart, CurrencyType } from "@/contexts/CartContext";
import MenuCard from "@/components/menu/MenuCard";
import { mockMenuItems } from "@/data/mockData"; 
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CallAssistanceButton from "@/components/menu/CallAssistanceButton";
import { DollarSign, CreditCard } from "lucide-react";

const MenuPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const { currentCurrency, setCurrency } = useCart();
  
  // Extract unique categories from menuItems
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(mockMenuItems.map((item) => item.category))
    ) as string[];
    setCategories(uniqueCategories);
  }, []);

  // Handle currency change
  const toggleCurrency = () => {
    setCurrency(currentCurrency === "USD" ? "KSH" : "USD");
  };

  return (
    <div className="pb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gradient">Our Menu</h1>
        <p className="text-gray-400">
          Order directly from your phone
        </p>
        
        {/* Currency toggle button */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCurrency}
            className="glass-morphism border-white/10 text-sm flex items-center"
          >
            {currentCurrency === "USD" ? (
              <>
                <DollarSign className="h-4 w-4 mr-1" />
                USD
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-1" />
                KSH
              </>
            )}
          </Button>
        </div>
      </div>
      
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
