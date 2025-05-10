
import { useState } from "react";
import { useCart, Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  SmilePlus, 
  Smile, 
  Meh, 
  Frown, 
  FrownOpen 
} from "lucide-react";

interface FeedbackModuleProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModule = ({ order, isOpen, onClose }: FeedbackModuleProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const { addFeedback } = useCart();

  const handleSubmitFeedback = () => {
    if (rating !== null) {
      addFeedback(order.id, order.tableId, rating, comment || undefined);
      onClose();
    }
  };

  const ratingEmojis = [
    { value: 1, icon: <FrownOpen className="h-8 w-8" />, label: "Very Poor" },
    { value: 2, icon: <Frown className="h-8 w-8" />, label: "Poor" },
    { value: 3, icon: <Meh className="h-8 w-8" />, label: "Okay" },
    { value: 4, icon: <Smile className="h-8 w-8" />, label: "Good" },
    { value: 5, icon: <SmilePlus className="h-8 w-8" />, label: "Excellent" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neo-blur border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-gradient text-xl">How was your experience?</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between mb-6">
            {ratingEmojis.map((emoji) => (
              <div
                key={emoji.value}
                onClick={() => setRating(emoji.value)}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                  rating === emoji.value 
                    ? "bg-primary/20 border border-primary/50 scale-110" 
                    : "hover:bg-white/10"
                }`}
              >
                <div className={`text-2xl ${
                  rating === emoji.value ? "text-primary" : "text-gray-400"
                }`}>
                  {emoji.icon}
                </div>
                <span className={`text-xs mt-1 ${
                  rating === emoji.value ? "text-primary" : "text-gray-400"
                }`}>
                  {emoji.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-300">Additional Comments (Optional)</label>
            <Textarea 
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass-morphism bg-transparent border-white/10 focus:border-primary/50 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="glass-morphism border-white/10"
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmitFeedback}
            disabled={rating === null}
            className={`
              ${rating !== null 
                ? "bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 shadow-[0_0_10px_rgba(155,135,245,0.3)]" 
                : "bg-gray-600 cursor-not-allowed"}
            `}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModule;
