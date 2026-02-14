import { useEffect, useState } from 'react';
import { useCamera } from '../../camera/useCamera';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Camera, X, RotateCw, AlertCircle, Upload, Video } from 'lucide-react';

interface CoinCameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  onSwitchToUpload: () => void;
}

export function CoinCameraCapture({
  onCapture,
  onCancel,
  onSwitchToUpload,
}: CoinCameraCaptureProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1920,
    height: 1920,
    quality: 0.92,
    format: 'image/jpeg',
  });

  const [isMobile, setIsMobile] = useState(false);
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleStartCamera = async () => {
    setHasAttemptedStart(true);
    await startCamera();
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      await stopCamera();
      onCapture(file);
    }
  };

  const handleCancel = async () => {
    await stopCamera();
    onCancel();
  };

  const handleSwitchToUpload = async () => {
    await stopCamera();
    onSwitchToUpload();
  };

  const handleRetry = async () => {
    await retry();
  };

  // Get user-friendly error message and guidance
  const getErrorGuidance = () => {
    if (!error) return null;

    switch (error.type) {
      case 'permission':
        return {
          title: 'Camera Permission Blocked',
          message:
            'Camera access was denied. To use your camera:\n\n1. Check your browser address bar for a camera icon or permissions button\n2. Allow camera access for this site\n3. Refresh the page and try again\n\nAlternatively, you can upload an image from your device instead.',
          showRetry: true,
        };
      case 'not-supported':
        return {
          title: 'Camera Not Supported',
          message:
            'Your browser does not support camera access. Please use the upload option to select an image from your device instead.',
          showRetry: false,
        };
      case 'not-found':
        return {
          title: 'No Camera Found',
          message:
            'No camera was detected on your device. Please use the upload option to select an image from your device instead.',
          showRetry: false,
        };
      case 'unknown':
      default:
        return {
          title: 'Camera Error',
          message:
            'An unexpected error occurred while accessing the camera. Please try again or use the upload option instead.',
          showRetry: true,
        };
    }
  };

  const errorGuidance = getErrorGuidance();

  if (isSupported === false) {
    return (
      <Card>
        <CardContent className="py-12 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Not Supported</AlertTitle>
            <AlertDescription>
              Your browser does not support camera access. Please use the upload option to select
              an image from your device.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={handleSwitchToUpload} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image Instead
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative bg-black">
          <div className="relative w-full" style={{ aspectRatio: '1/1', minHeight: '300px' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Initial state - before camera starts */}
            {!hasAttemptedStart && !isActive && !error && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Capture</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Click "Start Camera" below to begin
                  </p>
                </div>
              </div>
            )}

            {/* Overlay guide - only show when camera is active */}
            {isActive && !error && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 border-2 border-white/50 rounded-full" />
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="font-medium">Starting camera...</p>
                  <p className="text-sm opacity-80 mt-1">Please allow camera access</p>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && errorGuidance && (
              <div className="absolute inset-4 flex items-center justify-center z-10">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{errorGuidance.title}</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-line">
                    {errorGuidance.message}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-card">
            {/* Initial state controls */}
            {!hasAttemptedStart && !isActive && !error && (
              <div className="flex items-center justify-between gap-4">
                <Button variant="outline" size="icon" onClick={handleCancel}>
                  <X className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  onClick={handleStartCamera}
                  disabled={isLoading}
                  className="flex-1 h-14"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Start Camera
                </Button>

                <Button variant="outline" size="icon" onClick={handleSwitchToUpload}>
                  <Upload className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Active camera controls */}
            {(isActive || (hasAttemptedStart && !error)) && (
              <div className="flex items-center justify-between gap-4">
                <Button variant="outline" size="icon" onClick={handleCancel}>
                  <X className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  onClick={handleCapture}
                  disabled={!isActive || isLoading}
                  className="flex-1 h-14"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Capture Photo
                </Button>

                {isMobile && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => switchCamera()}
                    disabled={!isActive || isLoading}
                  >
                    <RotateCw className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Error state controls */}
            {error && (
              <div className="flex gap-2 mt-2">
                {errorGuidance?.showRetry && (
                  <Button onClick={handleRetry} variant="outline" className="flex-1">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
                <Button onClick={handleSwitchToUpload} variant="secondary" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Instead
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
