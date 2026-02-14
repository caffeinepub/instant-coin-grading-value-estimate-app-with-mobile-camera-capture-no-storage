import { useState } from 'react';
import { useActor } from './useActor';
import { extractImageFeatures } from '../utils/coinImageHeuristics';
import { preprocessImage } from '../utils/imagePreprocess';
import type { CoinMetadata, AnalysisResultData } from '../types/coin';

export function useCoinAnalysis() {
  const { actor } = useActor();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCoin = async (image: File, metadata: CoinMetadata): Promise<boolean> => {
    if (!actor) {
      setError('Backend connection not available. Please refresh the page and try again.');
      setIsAnalyzing(false);
      return false;
    }

    // Clear previous results and start fresh
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      // Preprocess image
      const processedImage = await preprocessImage(image);

      // Extract features
      const features = await extractImageFeatures(processedImage);

      // Build metadata string
      const metadataString = JSON.stringify({
        country: metadata.country,
        denomination: metadata.denomination,
        year: metadata.year,
        mintMark: metadata.mintMark || 'None',
        notes: metadata.notes || 'None',
      });

      // Call backend
      const result = await actor.processCoin(
        metadataString,
        BigInt(Math.round(features.sharpness)),
        BigInt(Math.round(features.contrast)),
        BigInt(Math.round(features.edgeClarity))
      );

      if (result) {
        setAnalysisResult(result);
        setIsAnalyzing(false);
        return true;
      } else {
        setError('Analysis returned no results. Please try again or contact support.');
        setIsAnalyzing(false);
        return false;
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during analysis';
      setError(errorMessage);
      setIsAnalyzing(false);
      return false;
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return {
    analyzeCoin,
    isAnalyzing,
    analysisResult,
    error,
    clearAnalysis,
  };
}
