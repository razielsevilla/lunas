"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
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
  const [attempt, setAttempt] = useState(1);

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
        body: JSON.stringify({ qrUuid: uuid, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 423) {
          setError('Your account is locked due to too many failed PIN attempts. Contact support.');
        } else {
          setAttempt(prev => prev + 1);
          setError(data.error || 'Authentication failed.');
        }
        throw new Error(data.error || 'Authentication failed.');
      }

      // Success: store data and redirect
      sessionStorage.setItem('emergencyPatientData', JSON.stringify(data));
      router.push('/professional/emergency-view');
    } catch (submitError: any) {
      // Error already set
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setPin(numericValue);
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
              Enter your 6-digit professional PIN to continue.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              {/* 6-dot PIN input */}
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${
                      i < pin.length
                        ? 'bg-white text-black border-white'
                        : 'border-white/30 text-transparent'
                    }`}
                  >
                    {i < pin.length ? '●' : ''}
                  </div>
                ))}
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="sr-only" // Hidden input for accessibility
                maxLength={6}
                autoFocus
              />

              {error && (
                <p className="text-sm text-red-300 text-center">
                  {error}
                  {attempt > 1 && !error.includes('locked') && (
                    <span className="block mt-1">Attempt {attempt} of 5</span>
                  )}
                </p>
              )}

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
