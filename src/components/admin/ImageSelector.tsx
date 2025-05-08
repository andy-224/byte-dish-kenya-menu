
import React, { useState, useCallback } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Image, Upload, Copy, Link as LinkIcon, Check, Loader2 } from "lucide-react";

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

interface ImageSelectorProps {
  currentImage: string;
  onImageSelected: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ currentImage, onImageSelected }) => {
  const [selectedTab, setSelectedTab] = useState<string>("preset");
  const [urlInput, setUrlInput] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [pastedUrl, setPastedUrl] = useState<string>("");
  const [showPasteSuccess, setShowPasteSuccess] = useState<boolean>(false);

  // Handle file upload from device
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);

    // Create a FileReader to read the image as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading file');
    };

    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Handle image selection from presets
  const handleSelectPreset = useCallback((value: string) => {
    onImageSelected(value);
  }, [onImageSelected]);

  // Handle custom URL input
  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onImageSelected(urlInput);
      setUrlInput("");
    }
  }, [urlInput, onImageSelected]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              onImageSelected(result);
              setPastedUrl(result);
              setShowPasteSuccess(true);
              setTimeout(() => setShowPasteSuccess(false), 3000);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      
      // If we didn't find an image, try to get text (might be a URL)
      const text = await navigator.clipboard.readText();
      if (text.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)/i)) {
        onImageSelected(text);
        setPastedUrl(text);
        setShowPasteSuccess(true);
        setTimeout(() => setShowPasteSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Could not access clipboard. Please paste a URL manually or try another method.');
    }
  }, [onImageSelected]);

  return (
    <div className="space-y-4">
      {/* Preview of current image */}
      <div className="relative aspect-video rounded-md overflow-hidden border border-white/10">
        <img 
          src={currentImage || '/placeholder.svg'} 
          alt="Menu item" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Image source selection tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="preset">
            <Image className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Presets</span>
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="paste">
            <Copy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Paste</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="upload">
          <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-500/30 rounded-lg">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                <p className="text-sm text-gray-400">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400 mb-2">Upload image from your device</p>
                <label className="cursor-pointer">
                  <div className="bg-primary/20 text-white px-4 py-2 rounded-md hover:bg-primary/30 transition-colors">
                    Select Image
                  </div>
                  <input 
                    type="file" 
                    className="hidden"
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                </label>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paste">
          <div className="space-y-4">
            {showPasteSuccess ? (
              <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-green-500/20 rounded-md">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-green-400 text-sm">Image pasted successfully</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-500/30 rounded-lg">
                <Copy className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400 mb-2">Paste image from clipboard</p>
                <Button type="button" onClick={handlePaste} className="neo-blur">
                  <Copy className="h-4 w-4 mr-2" />
                  Paste from Clipboard
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Copy an image first, then click the button above
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageSelector;
