import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { SubmittedMetadataSummary } from './SubmittedMetadataSummary';
import { EstimateDisclaimer } from './EstimateDisclaimer';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RotateCcw, AlertCircle, TrendingUp } from 'lucide-react';
import type { AnalysisResultData, CoinMetadata } from '../../types/coin';
import { useEffect, useState } from 'react';

interface AnalysisResultProps {
  result: AnalysisResultData | null;
  metadata: CoinMetadata | null;
  image: File | null;
  onAnalyzeAnother: () => void;
  error?: string | null;
}

export function AnalysisResult({
  result,
  metadata,
  image,
  onAnalyzeAnother,
  error,
}: AnalysisResultProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  // Error state - show error with retry option
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {imageUrl && (
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={imageUrl} alt="Coin that failed analysis" className="w-full h-full object-cover" />
            </div>
          )}
          {metadata && <SubmittedMetadataSummary metadata={metadata} />}
          <Button onClick={onAnalyzeAnother} size="lg" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Missing result - defensive fallback
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            No Results Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Analysis results are not available. This may be due to a technical issue.
            </AlertDescription>
          </Alert>
          {imageUrl && (
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={imageUrl} alt="Analyzed coin" className="w-full h-full object-cover" />
            </div>
          )}
          <Button onClick={onAnalyzeAnother} size="lg" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Success state - show full results
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {imageUrl ? (
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img src={imageUrl} alt="Analyzed coin" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
              <p className="text-sm text-muted-foreground">Image not available</p>
            </div>
          )}

          {metadata && <SubmittedMetadataSummary metadata={metadata} />}

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Grade</p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {result.gradeOutcome.gradeLabel}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
              <p className="text-3xl font-bold text-foreground">
                ${result.valueReport.estimatedValue.toString()} USD
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="font-medium">Value Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Baseline Value:</span>
                <span className="font-medium">${result.valueReport.baselineValue.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade Multiplier:</span>
                <span className="font-medium">×{result.valueReport.gradeMultiplier.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grade Bonus:</span>
                <span className="font-medium">+${result.valueReport.gradeBonus.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rarity Bonus:</span>
                <span className="font-medium">+${result.valueReport.combinedRarityBonus.toString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total Estimated Value:</span>
                <span>${result.valueReport.estimatedValue.toString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong>Quality Metrics:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Normalized Score: {result.gradeOutcome.normalizedScore.toString()}</li>
              <li>Edge Clarity Score: {result.gradeOutcome.edgeClarityScore.toString()}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <EstimateDisclaimer />

      <Button onClick={onAnalyzeAnother} size="lg" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Analyze Another Coin
      </Button>
    </div>
  );
}
