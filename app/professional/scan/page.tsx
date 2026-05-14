"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Flashlight, RotateCw, X, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';

type QRScanResult = {
  uuid: string;
  data: string;
};

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Extract UUID from QR data
  const extractUUID = (qrData: string): string | null => {
    // Match UUID pattern in QR data (could be a full URL or just UUID)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = qrData.match(uuidPattern);
    return match ? match[0] : null;
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => {
          console.error('Failed to play video:', err);
          setError('Failed to start video stream');
        });
      }

      // Check for torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      if (capabilities && 'torch' in capabilities) {
        // Torch is supported
      }

      // Check for multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      setIsScanning(true);
      startQRScan();
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(`Failed to access camera: ${err.message}`);
      }
      setIsInitializing(false);
    }
  };

  // Start QR scanning
  const startQRScan = () => {
    const scan = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const uuid = extractUUID(code.data);
        if (uuid) {
          setScannedData({ uuid, data: code.data });
          setIsScanning(false);
          setIsTorchOn(false); // Turn off torch when scan is complete
          // Navigate after a brief delay for UX
          setTimeout(() => {
            router.push(`/scan/${uuid}`);
          }, 500);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    };

    animationFrameRef.current = requestAnimationFrame(scan);
  };

  // Toggle torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const settings = track.getSettings?.();

      if (settings?.torch !== undefined) {
        await track.applyConstraints({
          advanced: [{ torch: !isTorchOn } as any],
        });
        setIsTorchOn(!isTorchOn);
      }
    } catch (err) {
      console.error('Failed to toggle torch:', err);
    }
  };

  // Switch camera
  const switchCamera = async () => {
    const newFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(newFacingMode);
    setIsScanning(false);
    setScannedData(null);
    setError(null);
    setIsTorchOn(false);
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    initializeCamera();
    return () => stopScanning();
  }, [cameraFacingMode]);

  useEffect(() => {
    const onVideoCanPlay = () => {
      setIsInitializing(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('canplay', onVideoCanPlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', onVideoCanPlay);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-300 ring-1 ring-blue-500/20">
            <Camera className="h-4 w-4" />
            QR Code Scanner
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Scan Patient QR Code</h1>
          <p className="mt-3 text-slate-300">Position the QR code within the frame to authenticate patient access.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-[1.5rem] border-l-4 border-red-500 bg-red-500/10 p-5 ring-1 ring-red-500/20">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Camera Error</p>
                <p className="mt-2 text-sm text-red-300">{error}</p>
                <button
                  onClick={initializeCamera}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-600/30 transition-colors"
                >
                  Retry Camera Access
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Container */}
        {!error && (
          <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="h-[400px] w-full object-cover"
              playsInline
              autoPlay
              muted
            />

            {/* Scanner Overlay */}
            {isScanning && (
              <>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {/* Animated scanning frame */}
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-0 border-2 border-blue-400 rounded-2xl" />
                    <div className="absolute inset-2 border border-dashed border-blue-400/50 rounded-xl animate-pulse" />
                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-blue-400" />
                    <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-blue-400" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-blue-400" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-blue-400" />
                  </div>
                </div>

                {/* Scanning indicator */}
                <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-blue-500/20 px-4 py-2 text-center">
                    <p className="text-sm font-semibold text-blue-200 flex items-center gap-2 justify-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      Scanning...
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Loading State */}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-400" />
                  <p className="text-sm font-medium text-slate-300">Initializing camera...</p>
                </div>
              </div>
            )}

            {/* Scanned Success State */}
            {scannedData && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-900/40 to-green-950/40 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-400">
                    <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-green-200">QR Code Scanned!</p>
                  <p className="mt-2 text-sm text-green-300">Redirecting to patient access...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden Canvas for QR processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Control Buttons */}
        {!error && (
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Torch Button */}
            <button
              onClick={toggleTorch}
              disabled={!isScanning}
              className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3 font-semibold text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Toggle flashlight"
            >
              <Flashlight className={`h-4 w-4 ${isTorchOn ? 'text-yellow-400' : ''}`} />
              {isTorchOn ? 'Torch On' : 'Torch Off'}
            </button>

            {/* Switch Camera Button */}
            {hasMultipleCameras && (
              <button
                onClick={switchCamera}
                disabled={!isScanning}
                className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3 font-semibold text-slate-100 ring-1 ring-slate-700 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Switch camera"
              >
                <RotateCw className="h-4 w-4" />
                {cameraFacingMode === 'environment' ? 'Front Camera' : 'Back Camera'}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 font-semibold text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/20 transition-colors"
              title="Close scanner"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-900/50 p-6 text-center">
          <h3 className="font-semibold text-white mb-2">How to scan</h3>
          <ol className="text-sm text-slate-300 space-y-2 text-left">
            <li>1. Request the patient's QR code</li>
            <li>2. Position the QR code in the scanner frame</li>
            <li>3. Wait for automatic detection and scanning</li>
            <li>4. You'll be redirected to enter your professional PIN</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
