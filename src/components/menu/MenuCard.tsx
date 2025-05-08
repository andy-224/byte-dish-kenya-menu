
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
import { useCart, MenuItem, CartItem } from "@/contexts/CartContext";

interface MenuCardProps {
  item: MenuItem;
  className?: string;
  style?: React.CSSProperties;
}

const MenuCard = ({ item, className, style }: MenuCardProps) => {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleAddToCart = () => {
    // Create a CartItem from the MenuItem
    const cartItem: CartItem = {
      ...item,
      quantity,
      specialInstructions
    };
    
    addItem(cartItem);
    setIsOpen(false);
    // Reset values after adding to cart
    setQuantity(1);
    setSpecialInstructions("");
  };

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg"; // Fall back to placeholder
  };

  return (
    <>
      <div 
        className={`menu-card ${className || ""}`}
        onClick={() => setIsOpen(true)}
        style={style}
      >
        <div className="relative">
          <div className="food-image aspect-video">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover" 
              onError={handleImageError}
            />
          </div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
            KES {item.price.toLocaleString()}
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-medium text-lg text-gradient">{item.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 h-10 mb-3">{item.description}</p>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 w-full rounded-lg shadow-[0_0_10px_rgba(155,135,245,0.3)] hover:shadow-[0_0_15px_rgba(155,135,245,0.5)] transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> View Item
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md neo-blur border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">{item.name}</DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="w-full h-48 rounded-md mb-4 border border-white/10 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover" 
                onError={handleImageError}
              />
            </div>
            
            <div className="flex justify-between items-center mb-4 bg-black/30 p-3 rounded-lg">
              <span className="font-medium text-gray-300">Price:</span>
              <span className="font-semibold text-gradient-primary">KES {item.price.toLocaleString()}</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Quantity</label>
              <div className="flex items-center bg-black/30 p-2 rounded-lg">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 glass-morphism border border-white/10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-white">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 glass-morphism border border-white/10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Special instructions</label>
              <Textarea 
                placeholder="Any special requests or allergies?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="glass-morphism bg-transparent border-white/10 focus:border-primary/50 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="glass-morphism border-white/10"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 shadow-[0_0_10px_rgba(155,135,245,0.3)]"
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
