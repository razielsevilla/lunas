"use client";

import { useEffect, useState } from 'react';
import { Download, Printer, RefreshCcw } from 'lucide-react';

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

  const refreshQrCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/patient/qr', { cache: 'no-store' });
      const data = (await response.json()) as Partial<QrResponse> & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load QR code.');
      }

      setQrCode({ 
        qrUuid: data.qrUuid ?? '', 
        qrImageBase64: data.qrImageBase64 ?? '',
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
      });
    } catch (refreshError: any) {
      setError(refreshError.message || 'Unable to load QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Full Page Loading State (Outside the Card)
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
      <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">My QR Code</h1>
            <p className="mt-2 text-sm text-[#8d8374]">Your permanent emergency access code.</p>
          </div>
          <Badge variant="success">Permanent</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Emergency passport QR</CardTitle>
            <CardDescription>Use this QR code to open your medical record in emergency situations.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex min-h-[24rem] items-center justify-center">
                <Spinner size="lg" label="Loading QR code" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
                <Button variant="outline" className="mt-4 block" onClick={refreshQrCode}>Try Again</Button>
              </div>
            ) : qrCode ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="flex items-center justify-center rounded-[2rem] bg-[#fbf8f2] p-8">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 shadow-2xl border border-white/10 w-full max-w-[320px]">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-6 flex items-center gap-2 self-start">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-200 to-amber-500">
                           <div className="h-3 w-3 rounded-full bg-[#0f172a]/20 backdrop-blur-sm" />
                        </div>
                        <span className="text-sm font-bold tracking-widest text-white">LUNAS</span>
                        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/80">Passport</span>
                      </div>
                      
                      <div className="rounded-2xl bg-white p-4 shadow-inner ring-4 ring-white/10">
                        <img
                          src={qrCode.qrImageBase64}
                          alt="Patient QR code"
                          className="h-48 w-48 object-contain mix-blend-multiply"
                        />
                      </div>
                      
                      <div className="mt-6 w-full text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Patient</p>
                        <p className="text-lg font-bold text-white tracking-wide truncate">{qrCode.firstName} {qrCode.lastName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="rounded-2xl border border-neutral-200 bg-[#fbf8f2] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Passport UUID</p>
                    <p className="mt-2 break-all font-mono text-xs font-semibold text-[#1a1c1e]">{qrCode.qrUuid}</p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full h-12 rounded-xl bg-[#1a1c1e] text-white" 
                      onClick={downloadQrCode}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download PNG
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl" 
                      onClick={printQrCode}
                    >
                      <Printer className="mr-2 h-4 w-4" /> Print Passport
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full h-12 rounded-xl" 
                      onClick={refreshQrCode}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" /> Refresh Code
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PatientLayout>
  );
}