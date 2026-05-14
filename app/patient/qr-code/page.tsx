"use client";

import { useEffect, useState } from 'react';
import { Download, Printer, RefreshCcw } from 'lucide-react';

import { PatientLayout } from '@/components/layout/PatientLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

type QrResponse = {
  qrUuid: string;
  qrImageBase64: string;
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
          setQrCode({ qrUuid: data.qrUuid ?? '', qrImageBase64: data.qrImageBase64 ?? '' });
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
    if (!qrCode?.qrImageBase64) {
      return;
    }

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrCode.qrImageBase64}`;
    link.download = 'lunas-qr-code.png';
    link.click();
  };

  const printQrCode = () => {
    window.print();
  };

  const refreshQrCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/patient/qr', { cache: 'no-store' });
      const data = (await response.json()) as Partial<QrResponse> & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load QR code.');
      }

      setQrCode({ qrUuid: data.qrUuid ?? '', qrImageBase64: data.qrImageBase64 ?? '' });
    } catch (refreshError: any) {
      setError(refreshError.message || 'Unable to load QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientLayout activePath="/patient/qr-code">
      <div className="mx-auto max-w-4xl space-y-8">
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
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : qrCode ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="flex items-center justify-center rounded-[2rem] bg-[#fbf8f2] p-8">
                  <img
                    src={`data:image/png;base64,${qrCode.qrImageBase64}`}
                    alt="Patient QR code"
                    className="h-auto w-full max-w-[320px] rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-neutral-200 bg-[#fbf8f2] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">UUID</p>
                    <p className="mt-2 break-all text-sm font-medium text-[#1a1c1e]">{qrCode.qrUuid}</p>
                  </div>

                  <Button className="w-full" onClick={downloadQrCode}>
                    <Download className="h-4 w-4" /> Download PNG
                  </Button>
                  <Button variant="outline" className="w-full" onClick={printQrCode}>
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={refreshQrCode}>
                    <RefreshCcw className="h-4 w-4" /> Refresh
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
