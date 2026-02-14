import { Alert, AlertDescription } from '../ui/alert';
import { Lightbulb } from 'lucide-react';

export function CaptureTips() {
  return (
    <Alert>
      <Lightbulb className="h-4 w-4" />
      <AlertDescription>
        <p className="font-medium mb-2">Tips for best results:</p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Use good lighting, avoid glare</li>
          <li>Center the coin and fill the frame</li>
          <li>Keep the camera steady and focused</li>
          <li>Photograph both sides if possible</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
