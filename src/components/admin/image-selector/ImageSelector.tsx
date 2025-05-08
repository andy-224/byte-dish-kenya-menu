
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload, Copy } from "lucide-react";

import ImagePreview from "./ImagePreview";
import PresetImageTab from "./PresetImageTab";
import UploadImageTab from "./UploadImageTab";
import PasteImageTab from "./PasteImageTab";

interface ImageSelectorProps {
  currentImage: string;
  onImageSelected: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ currentImage, onImageSelected }) => {
  const [selectedTab, setSelectedTab] = useState<string>("preset");
  const [urlInput, setUrlInput] = useState<string>("");

  return (
    <div className="space-y-4">
      {/* Preview of current image */}
      <ImagePreview currentImage={currentImage} />

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

        <TabsContent value="preset">
          <PresetImageTab 
            onImageSelected={onImageSelected} 
            urlInput={urlInput} 
            setUrlInput={setUrlInput} 
          />
        </TabsContent>

        <TabsContent value="upload">
          <UploadImageTab onImageSelected={onImageSelected} />
        </TabsContent>

        <TabsContent value="paste">
          <PasteImageTab onImageSelected={onImageSelected} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageSelector;
