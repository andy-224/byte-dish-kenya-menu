
import React from "react";

interface ImagePreviewProps {
  currentImage: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ currentImage }) => {
  return (
    <div className="relative aspect-video rounded-md overflow-hidden border border-white/10">
      <img 
        src={currentImage || '/placeholder.svg'} 
        alt="Menu item" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImagePreview;
