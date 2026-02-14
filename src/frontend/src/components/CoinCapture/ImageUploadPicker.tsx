import { useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Upload, X } from 'lucide-react';

interface ImageUploadPickerProps {
  onImageSelected: (file: File) => void;
  onCancel: () => void;
}

export function ImageUploadPicker({ onImageSelected, onCancel }: ImageUploadPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upload Coin Image</span>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Choose an image</p>
          <p className="text-sm text-muted-foreground mb-6">
            Select a clear photo of your coin
          </p>
          <Button onClick={handleClick} size="lg">
            Select Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
