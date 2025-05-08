
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";

// Sample preset images for quick selection
const sampleImages = [
  {
    value: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    label: "Food Platter"
  },
  {
    value: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1780&auto=format&fit=crop",
    label: "Pancakes"
  },
  {
    value: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1780&auto=format&fit=crop",
    label: "Pizza"
  },
  {
    value: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1780&auto=format&fit=crop",
    label: "Burger"
  },
  {
    value: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1780&auto=format&fit=crop",
    label: "Dessert"
  }
];

interface PresetImageTabProps {
  onImageSelected: (imageUrl: string) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
}

const PresetImageTab: React.FC<PresetImageTabProps> = ({ onImageSelected, urlInput, setUrlInput }) => {
  const handleSelectPreset = (value: string) => {
    onImageSelected(value);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelected(urlInput);
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleSelectPreset}>
        <SelectTrigger className="neo-blur">
          <SelectValue placeholder="Choose a preset image" />
        </SelectTrigger>
        <SelectContent>
          {sampleImages.map((img) => (
            <SelectItem key={img.value} value={img.value}>
              {img.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="space-y-2">
        <Label htmlFor="custom-url">Or enter image URL</Label>
        <div className="flex gap-2">
          <Input
            id="custom-url"
            placeholder="https://example.com/image.jpg"
            className="neo-blur flex-1"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button 
            type="button" 
            size="icon" 
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresetImageTab;
