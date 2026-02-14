import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface CapturePreviewProps {
  image: File;
  onRetake: () => void;
  onContinue: () => void;
}

export function CapturePreview({ image, onRetake, onContinue }: CapturePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Your Coin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
          <img src={imageUrl} alt="Captured coin" className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onRetake} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
