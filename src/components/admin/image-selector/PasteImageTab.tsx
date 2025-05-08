
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface PasteImageTabProps {
  onImageSelected: (imageUrl: string) => void;
}

const PasteImageTab: React.FC<PasteImageTabProps> = ({ onImageSelected }) => {
  const [showPasteSuccess, setShowPasteSuccess] = useState<boolean>(false);
  const [pastedUrl, setPastedUrl] = useState<string>("");

  const handlePaste = async () => {
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
  };

  return (
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
  );
};

export default PasteImageTab;
