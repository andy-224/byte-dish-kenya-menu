
import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface UploadImageTabProps {
  onImageSelected: (imageUrl: string) => void;
}

const UploadImageTab: React.FC<UploadImageTabProps> = ({ onImageSelected }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
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
  );
};

export default UploadImageTab;
