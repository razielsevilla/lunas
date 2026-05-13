"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

type ScanPreviewResponse = {
  firstName: string;
  lastName: string;
  qrUuid: string;
};

export default function PinEntryPage() {
  const router = useRouter();
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;

  const [patientFirstName, setPatientFirstName] = useState('patient');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPatientName = async () => {
      try {
        const response = await fetch(`/api/scan/${uuid}`, { cache: 'no-store' });
        const data = (await response.json()) as Partial<ScanPreviewResponse> & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load patient preview.');
        }

        if (!cancelled) {
          setPatientFirstName(data.firstName || 'patient');
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError.message || 'Unable to load patient preview.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPatientName();

    return () => {
      cancelled = true;
    };
  }, [uuid]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/scan/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/professional/dashboard');
    } catch (submitError: any) {
      setError(submitError.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-6 py-12 text-white">
      <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-12">
        {isLoading ? (
          <div className="flex min-h-[22rem] items-center justify-center">
            <Spinner size="lg" label="Loading patient preview" />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">Emergency access</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Accessing medical passport of {patientFirstName}.
            </h1>
            <p className="mt-4 text-sm text-white/60">
              Enter your professional PIN to continue.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit PIN"
                className="bg-white text-[#1a1c1e]"
              />

              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting || pin.length !== 6}>
                  {isSubmitting ? <Spinner size="sm" className="text-white" label="Authenticating" /> : null}
                  Authenticate
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Back
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
