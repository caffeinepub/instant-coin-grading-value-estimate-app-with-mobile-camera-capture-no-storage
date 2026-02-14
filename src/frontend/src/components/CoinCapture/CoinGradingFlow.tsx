import { useState } from 'react';
import { CoinCameraCapture } from './CoinCameraCapture';
import { ImageUploadPicker } from './ImageUploadPicker';
import { CapturePreview } from './CapturePreview';
import { CoinMetadataForm } from '../Metadata/CoinMetadataForm';
import { AnalysisResult } from '../Results/AnalysisResult';
import { CaptureTips } from './CaptureTips';
import { HeroBackdrop } from '../Brand/HeroBackdrop';
import { FlowFallbackErrorCard } from './FlowFallbackErrorCard';
import { useCoinAnalysis } from '../../hooks/useCoinAnalysis';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Camera, Upload } from 'lucide-react';
import type { CoinMetadata } from '../../types/coin';

type FlowStep = 'capture' | 'preview' | 'metadata' | 'analyzing' | 'results';

export function CoinGradingFlow() {
  const [step, setStep] = useState<FlowStep>('capture');
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload' | null>(null);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<CoinMetadata | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);

  const { analyzeCoin, isAnalyzing, analysisResult, error, clearAnalysis } = useCoinAnalysis();

  const handleImageCaptured = (file: File) => {
    setCapturedImage(file);
    setFlowError(null);
    setStep('preview');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCaptureMode(null);
    setFlowError(null);
    setStep('capture');
  };

  const handleContinueToMetadata = () => {
    if (!capturedImage) {
      setFlowError('No image captured. Please capture or upload an image first.');
      return;
    }
    setFlowError(null);
    setStep('metadata');
  };

  const handleMetadataSubmit = async (coinMetadata: CoinMetadata) => {
    // Validate that we have an image before starting analysis
    if (!capturedImage) {
      setFlowError('No image available. Please go back and capture or upload an image.');
      return;
    }

    setMetadata(coinMetadata);
    setFlowError(null);
    setStep('analyzing');

    // Wait for analysis to complete
    const success = await analyzeCoin(capturedImage, coinMetadata);
    
    // Only transition to results if analysis succeeded
    if (success) {
      setStep('results');
    } else {
      // Stay on analyzing step to show error, but allow user to see it
      setStep('results');
    }
  };

  const handleAnalyzeAnother = () => {
    setCapturedImage(null);
    setMetadata(null);
    setCaptureMode(null);
    setFlowError(null);
    clearAnalysis();
    setStep('capture');
  };

  const handleSwitchToUpload = () => {
    setCaptureMode('upload');
  };

  // Capture method selection
  if (step === 'capture' && !captureMode) {
    return (
      <HeroBackdrop>
        <div className="py-12">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Choose Capture Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CaptureTips />
              <div className="grid gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => setCaptureMode('camera')}
                  className="h-auto py-6 flex flex-col gap-2"
                >
                  <Camera className="w-8 h-8" />
                  <span className="text-base">Use Camera</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setCaptureMode('upload')}
                  className="h-auto py-6 flex flex-col gap-2"
                >
                  <Upload className="w-8 h-8" />
                  <span className="text-base">Upload Image</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </HeroBackdrop>
    );
  }

  // Camera capture
  if (step === 'capture' && captureMode === 'camera') {
    return (
      <CoinCameraCapture
        onCapture={handleImageCaptured}
        onCancel={handleRetake}
        onSwitchToUpload={handleSwitchToUpload}
      />
    );
  }

  // Upload picker
  if (step === 'capture' && captureMode === 'upload') {
    return <ImageUploadPicker onImageSelected={handleImageCaptured} onCancel={handleRetake} />;
  }

  // Preview with image validation
  if (step === 'preview') {
    if (!capturedImage) {
      return <FlowFallbackErrorCard onRestart={handleAnalyzeAnother} />;
    }
    return (
      <CapturePreview
        image={capturedImage}
        onRetake={handleRetake}
        onContinue={handleContinueToMetadata}
      />
    );
  }

  // Metadata form with image validation
  if (step === 'metadata') {
    if (!capturedImage) {
      return <FlowFallbackErrorCard onRestart={handleAnalyzeAnother} />;
    }
    return (
      <CoinMetadataForm
        onSubmit={handleMetadataSubmit}
        onBack={() => setStep('preview')}
        flowError={flowError}
        onClearError={() => setFlowError(null)}
        onReturnToCapture={handleRetake}
      />
    );
  }

  // Analyzing state
  if (step === 'analyzing') {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium">Analyzing your coin...</p>
            <p className="text-sm text-muted-foreground">
              Processing image and calculating grade
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results with validation
  if (step === 'results') {
    // If we have an error but no result, show error state
    if (error && !analysisResult) {
      return (
        <AnalysisResult
          result={null}
          metadata={metadata}
          image={capturedImage}
          onAnalyzeAnother={handleAnalyzeAnother}
          error={error}
        />
      );
    }

    // If we have a result and metadata, show results
    if (analysisResult && metadata) {
      return (
        <AnalysisResult
          result={analysisResult}
          metadata={metadata}
          image={capturedImage}
          onAnalyzeAnother={handleAnalyzeAnother}
          error={error}
        />
      );
    }

    // Fallback for invalid state
    return <FlowFallbackErrorCard onRestart={handleAnalyzeAnother} />;
  }

  // Final fallback for any unexpected state
  return <FlowFallbackErrorCard onRestart={handleAnalyzeAnother} />;
}
