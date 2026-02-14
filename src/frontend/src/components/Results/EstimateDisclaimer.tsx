import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';

export function EstimateDisclaimer() {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-medium mb-1">Important Disclaimer</p>
        <p className="text-sm">
          The grade and value estimates provided are approximations based on image analysis
          heuristics and may not reflect actual market value or professional grading standards.
          For accurate appraisals, please consult a certified numismatist or professional
          grading service.
        </p>
      </AlertDescription>
    </Alert>
  );
}
