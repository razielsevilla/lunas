"use client";

import { useEffect, useState } from 'react';
/* Import the custom LunasLoader */
import LunasLoader from '@/components/ui/loader'; 
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Lock, User, Hash, AlertTriangle, CheckCircle2 } from 'lucide-react';

type ProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string | null;
  prcNumber: string;
  profession: string;
  specialization: string;
  hospitalAffiliation: string;
  prcStatus: string;
  pinSet: boolean;
};

export default function ProfessionalProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PIN Management State
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/professional/profile');
      if (!response.ok) {
        throw new Error('Failed to load profile data');
      }
      const profileData = await response.json();
      setData(profileData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(false);

    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinError('New PIN must be exactly 6 digits.');
      return;
    }

    if (data?.pinSet && currentPin.length !== 6) {
      setPinError('Please enter your 6-digit current PIN.');
      return;
    }

    setIsChangingPin(true);
    try {
      const res = await fetch('/api/professional/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin: data?.pinSet ? currentPin : null, newPin }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Failed to change PIN.');

      setPinSuccess(true);
      setCurrentPin('');
      setNewPin('');
      await fetchProfile(); 
    } catch (err: any) {
      setPinError(err.message);
    } finally {
      setIsChangingPin(false);
    }
  };

  const handlePinInput = (val: string, setter: (val: string) => void) => {
    setter(val.replace(/\D/g, '').slice(0, 6));
  };

  /* UI UPDATE: Replaced generic Spinner with LunasLoader */
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LunasLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 font-['Plus_Jakarta_Sans']">
        Error loading profile: {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    /* Main UI remains focused on the Design System specifications provided previously */
    <div className="min-h-screen bg-[#F9F5EB] px-10 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#0B1120] font-['Playfair_Display',_serif]">
            Professional Profile
          </h1>
          <p className="mt-2 text-[#5c6066] font-['Plus_Jakarta_Sans',_sans-serif]">
            Manage your identity and medical access credentials.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm font-['Plus_Jakarta_Sans',_sans-serif]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B8C70]/10">
                  <User className="h-5 w-5 text-[#7B8C70]" />
                </div>
                <h2 className="text-xl font-bold text-[#0B1120]">Personal Identity</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Full Name</p>
                  <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.firstName} {data.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Email Address</p>
                  <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Mobile Number</p>
                  <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.mobile || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm relative overflow-hidden font-['Plus_Jakarta_Sans',_sans-serif]">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Hash className="h-48 w-48 text-[#0B1120]" />
              </div>
              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B8C70]/10">
                      <ShieldCheck className="h-5 w-5 text-[#7B8C70]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0B1120]">PRC Credentials</h2>
                  </div>
                  {data.prcStatus === 'VERIFIED' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">License Number</p>
                    <p className="mt-1 font-mono text-xl tracking-widest font-bold text-[#2D2822]">{data.prcNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Profession</p>
                    <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.profession}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Specialization</p>
                    <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.specialization || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Hospital Affiliation</p>
                    <p className="mt-1 text-lg font-medium text-[#2D2822]">{data.hospitalAffiliation || 'Independent'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 font-['Plus_Jakarta_Sans',_sans-serif]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B8C70]/10">
                  <Lock className="h-5 w-5 text-[#7B8C70]" />
                </div>
                <h2 className="text-xl font-bold text-[#0B1120]">Access PIN</h2>
              </div>

              <p className="text-sm text-[#5c6066] mb-6">
                Your 6-digit PIN is required to authorize access to patient medical passports after scanning their QR code.
              </p>

              {pinSuccess && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                  Your PIN has been updated successfully.
                </div>
              )}

              {pinError && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-200">
                  {pinError}
                </div>
              )}

              <form onSubmit={handlePinChange} className="space-y-5">
                {data.pinSet && (
                  <div className="space-y-2">
                    <label htmlFor="currentPin" className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">Current PIN</label>
                    <div className="relative">
                      <Input
                        id="currentPin"
                        type="password"
                        inputMode="numeric"
                        value={currentPin}
                        onChange={(e) => handlePinInput(e.target.value, setCurrentPin)}
                        placeholder="••••••"
                        className="tracking-[0.5em] font-mono text-center text-lg h-12 rounded-2xl border-neutral-200 focus:border-[#7B8C70] focus:ring-[#7B8C70]/20"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="newPin" className="text-xs font-bold uppercase tracking-wider text-[#7B8C70]">
                    {data.pinSet ? 'New 6-Digit PIN' : 'Set 6-Digit PIN'}
                  </label>
                  <div className="relative">
                    <Input
                      id="newPin"
                      type="password"
                      inputMode="numeric"
                      value={newPin}
                      onChange={(e) => handlePinInput(e.target.value, setNewPin)}
                      placeholder="••••••"
                      className="tracking-[0.5em] font-mono text-center text-lg h-12 rounded-2xl border-neutral-200 focus:border-[#7B8C70] focus:ring-[#7B8C70]/20"
                    />
                  </div>
                  <p className="text-[11px] text-[#5c6066] mt-1">Must be exactly 6 numbers.</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0B1120] text-white hover:bg-[#2D2822] rounded-2xl h-12"
                  disabled={isChangingPin || newPin.length !== 6 || (data.pinSet && currentPin.length !== 6)}
                >
                  {/* Internal button spinners remain standard to maintain focus on CTA status */}
                  {isChangingPin ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
                  {data.pinSet ? 'Update PIN' : 'Set PIN'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}