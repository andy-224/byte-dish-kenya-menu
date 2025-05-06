
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import { useCart, MenuItem } from "@/contexts/CartContext";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setIsOpen(false);
    // Reset values after adding to cart
    setQuantity(1);
    setSpecialInstructions("");
  };

  return (
    <>
      <div 
        className="menu-card animate-fade-in"
        onClick={() => setIsOpen(true)}
      >
        <div 
          className="food-image" 
          style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{item.name}</h3>
            <span className="font-semibold text-bytedish-dark">KES {item.price.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
          <Button 
            size="sm" 
            className="bg-bytedish-purple hover:bg-bytedish-dark-purple w-full"
            onClick={(e) => {
              e.stopPropagation();
              addItem(item);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add to Cart
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div 
              className="w-full h-48 rounded-md mb-4" 
              style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Price:</span>
              <span className="font-semibold">KES {item.price.toLocaleString()}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Special instructions</label>
              <Textarea 
                placeholder="Any special requests or allergies?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-bytedish-purple hover:bg-bytedish-dark-purple"
              onClick={handleAddToCart}
            >
              Add to Cart - KES {(item.price * quantity).toLocaleString()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuCard;
