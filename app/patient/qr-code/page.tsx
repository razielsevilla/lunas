"use client";

import { useEffect, useState } from 'react';
import { Download, Printer } from 'lucide-react';

import { PatientLayout } from '@/components/layout/PatientLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import LunasLoader from '@/components/ui/loader';

type QrResponse = {
  qrUuid: string;
  qrImageBase64: string;
  firstName: string;
  lastName: string;
};

export default function PatientQrCodePage() {
  const [qrCode, setQrCode] = useState<QrResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set Browser Tab Title
  useEffect(() => {
    document.title = "Lunas | Patient";
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadQrCode = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/patient/qr', { cache: 'no-store' });
        const data = (await response.json()) as Partial<QrResponse> & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load QR code.');
        }

        if (!cancelled) {
          setQrCode({ 
            qrUuid: data.qrUuid ?? '', 
            qrImageBase64: data.qrImageBase64 ?? '',
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
          });
          setError(null);
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError.message || 'Unable to load QR code.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadQrCode();

    return () => {
      cancelled = true;
    };
  }, []);

  const downloadQrCode = () => {
    if (!qrCode?.qrImageBase64) return;
    const link = document.createElement('a');
    link.href = qrCode.qrImageBase64;
    link.download = 'lunas-qr-code.png';
    link.click();
  };

  const printQrCode = () => window.print();

  if (isLoading) {
    return (
      <PatientLayout activePath="/patient/qr-code">
        <div className="flex h-[60vh] w-full items-center justify-center">
          <LunasLoader />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout activePath="/patient/qr-code">
      {/* STABLE WRAPPER: Fixed padding prevents layout snapping */}
      <div className="mx-auto max-w-5xl px-10 py-10">
        
        {/* ANIMATED CONTENT */}
        <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-[#2D2822]">
                My QR Code
              </h1>
              <p className="mt-2 text-sm font-medium text-[#7B8C70]">
                Your permanent emergency access code.
              </p>
            </div>
            <Badge variant="success">Permanent</Badge>
          </div>

          <Card className="overflow-hidden rounded-[2.5rem] border-neutral-200 shadow-sm">
            <CardHeader className="border-b border-neutral-50 bg-white p-8">
              <CardTitle className="font-serif text-2xl text-[#2D2822]">Emergency passport QR</CardTitle>
              <CardDescription className="text-[#7B8C70]">
                Use this QR code to open your medical record in emergency situations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {error ? (
                <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                  {error}
                  <Button variant="outline" className="mt-4 block" onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : qrCode ? (
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
                  {/* Visual QR Card Display */}
                  <div className="flex items-center justify-center rounded-[2.5rem] bg-[#F9F5EB] p-10">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#2D2822] p-8 shadow-2xl w-full max-w-[340px]">
                      {/* Decorative elements */}
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
                      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#7B8C70]/10 blur-2xl"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-8 flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#7B8C70]" />
                            <span className="text-xs font-bold tracking-[0.2em] text-white">LUNAS</span>
                          </div>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80">
                            Passport
                          </span>
                        </div>
                        
                        <div className="rounded-3xl bg-white p-5 shadow-inner">
                          <img
                            src={qrCode.qrImageBase64}
                            alt="Patient QR code"
                            className="h-44 w-44 object-contain"
                          />
                        </div>
                        
                        <div className="mt-8 w-full text-left">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7B8C70]">Patient</p>
                          <p className="mt-1 text-xl font-serif font-bold text-white tracking-wide truncate">
                            {qrCode.firstName} {qrCode.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions and Details */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="rounded-2xl border border-neutral-100 bg-[#F9F5EB]/50 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#7B8C70]">Passport UUID</p>
                      <p className="mt-2 break-all font-mono text-xs font-semibold text-[#2D2822]">
                        {qrCode.qrUuid}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full h-14 rounded-2xl bg-[#2D2822] text-white hover:bg-[#2D2822]/90" 
                        onClick={downloadQrCode}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download PNG
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-14 rounded-2xl border-neutral-200 hover:bg-[#F9F5EB]" 
                        onClick={printQrCode}
                      >
                        <Printer className="mr-2 h-4 w-4" /> Print Passport
                      </Button>
                    </div>
                    
                    <p className="text-center text-[11px] font-medium text-[#7B8C70] px-4">
                      Keep a printed copy in your wallet for emergencies.
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}