import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface FlowFallbackErrorCardProps {
  onRestart: () => void;
}

export function FlowFallbackErrorCard({ onRestart }: FlowFallbackErrorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          Something Went Wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The analysis flow encountered an unexpected state. This usually happens when required
            information is missing. Please start over to analyze your coin.
          </AlertDescription>
        </Alert>
        <Button onClick={onRestart} size="lg" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}
