"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader2, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  prcNumber: string;
  profession: string;
  specialization: string;
  hospitalAffiliation: string;
  password: string;
  confirmPassword: string;
  pin: string;
};

export default function ProfessionalRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    prcNumber: '',
    profession: '',
    specialization: '',
    hospitalAffiliation: '',
    password: '',
    confirmPassword: '',
    pin: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const forbiddenChars = /[\\\'\";\s]/;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    if (name === "mobile") {
      const numbersOnly = value.replace(/\D/g, "");
      if (numbersOnly.length <= 10) {
        setFormData((current) => ({ ...current, mobile: numbersOnly }));
      }
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
    if (error) setError(null);
  };

  const formatMobileDisplay = (val: string) => {
    const m = val.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!m) return "";
    return `${m[1]}${m[2] ? " " + m[2] : ""}${m[3] ? " " + m[3] : ""}`.trim();
  };

  const isStepOneComplete =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    emailRegex.test(formData.email) &&
    formData.mobile.length === 10;

  const isStepTwoComplete = formData.prcNumber.trim() !== '' && formData.profession.trim() !== '';

  const isStepThreeComplete =
    passwordRegex.test(formData.password) &&
    !forbiddenChars.test(formData.password) &&
    formData.password === formData.confirmPassword &&
    formData.pin.length === 6 &&
    /^\d+$/.test(formData.pin);

  const handleSubmit = async () => {
    if (!isStepThreeComplete) {
      setError('Please check your password requirements.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register/professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: `+63${formData.mobile}`,
          password: formData.password,
          prcNumber: formData.prcNumber,
          profession: formData.profession,
          specialization: formData.specialization || undefined,
          hospitalAffiliation: formData.hospitalAffiliation || undefined,
          pin: formData.pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Professional registration failed.');
      }

      router.push('/login?registered=professional');
    } catch (submitError: any) {
      setError(submitError.message || 'Professional registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbf8f2] font-sans">
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0f172a] p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-display font-bold tracking-tight text-white leading-tight">Verified care starts here</h2>
          <p className="mt-6 max-w-sm text-lg text-white/60 leading-relaxed">
            Register your PRC details so emergency access stays auditable and secure.
          </p>
        </div>
      </div>

      <main className="flex w-full flex-col p-8 md:p-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-200 to-amber-500" />
              <span className="text-xl font-bold text-[#0f172a]">Lunas</span>
            </div>
            <Link href="/login" className="text-sm font-medium text-[#8d8374] transition-colors hover:text-[#1a1c1e]">
              Back to login
            </Link>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-display font-bold tracking-tight text-[#1a1c1e]">Professional registration</h1>
            <p className="mt-2 font-medium text-[#8d8374]">Step {step} of 3</p>
          </div>

          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${index <= step ? 'bg-[#1a1c1e]' : 'bg-neutral-200'}`}
              />
            ))}
          </div>

          {error ? (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-200">
              {error}
            </div>
          ) : null}

          <form className="mt-10 space-y-6" onSubmit={(event) => event.preventDefault()}>
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                </div>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="dr.name@hospital.ph" />
                <div className="flex w-full items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors focus-within:border-[#c8c0b2] focus-within:ring-2 focus-within:ring-[#1a1c1e]/5 h-11">
                  <div className="bg-[#f9f9f9] px-4 py-2 text-sm font-bold border-r border-neutral-200 h-full flex items-center">+63</div>
                  <input
                    name="mobile"
                    value={formatMobileDisplay(formData.mobile)}
                    onChange={handleChange}
                    type="tel"
                    placeholder="917 555 0142"
                    className="w-full px-4 py-2 text-sm outline-none bg-transparent h-full"
                  />
                </div>
                <Button type="button" className="w-full" disabled={!isStepOneComplete} onClick={() => setStep(2)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-6">
                <Input name="prcNumber" value={formData.prcNumber} onChange={handleChange} placeholder="PRC license number" />
                <div className="space-y-2">
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-[#1a1c1e] outline-none transition-colors focus:border-[#c8c0b2] focus:ring-2 focus:ring-[#1a1c1e]/5"
                  >
                    <option value="">Select profession</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Emergency Medicine Specialist">Emergency Medicine Specialist</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Paramedic">Paramedic</option>
                    <option value="EMT">EMT</option>
                    <option value="Surgeon">Surgeon</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization (optional)" />
                <Input name="hospitalAffiliation" value={formData.hospitalAffiliation} onChange={handleChange} placeholder="Hospital affiliation (optional)" />
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Previous
                  </Button>
                  <Button type="button" className="flex-[2]" disabled={!isStepTwoComplete} onClick={() => setStep(3)}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-6">
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />

                <div className="pt-2">
                  <p className="text-sm font-semibold text-[#1a1c1e] mb-3">Medical Access PIN</p>
                  <label htmlFor="pin-input" className="flex justify-center space-x-3 cursor-pointer">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-colors ${
                          i < formData.pin.length
                            ? 'bg-[#1a1c1e] text-white border-[#1a1c1e]'
                            : 'border-neutral-300 text-transparent hover:border-neutral-400'
                        }`}
                      >
                        {i < formData.pin.length ? '●' : ''}
                      </div>
                    ))}
                  </label>
                  <input
                    id="pin-input"
                    type="text"
                    inputMode="numeric"
                    value={formData.pin}
                    onChange={(e) => setFormData(cur => ({ ...cur, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    className="sr-only"
                    maxLength={6}
                  />
                  <p className="text-center text-[11px] text-[#8d8374] mt-3">Used for authorizing QR scans.</p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100 grid grid-cols-2 gap-2">
                   <div className={`text-[10px] flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-600" : "text-[#8d8374]"}`}>
                      <Check className="h-3 w-3" /> 8+ Chars
                   </div>
                   <div className={`text-[10px] flex items-center gap-1 ${passwordRegex.test(formData.password) ? "text-green-600" : "text-[#8d8374]"}`}>
                      <Check className="h-3 w-3" /> Alpha & Number
                   </div>
                   <div className={`text-[10px] flex items-center gap-1 ${!forbiddenChars.test(formData.password) && formData.password.length > 0 ? "text-green-600" : "text-[#8d8374]"}`}>
                      <Check className="h-3 w-3" /> No Quotes/Spaces
                   </div>
                   <div className={`text-[10px] flex items-center gap-1 ${formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 ? "text-green-600" : "text-[#8d8374]"}`}>
                      <Check className="h-3 w-3" /> Match
                   </div>
                </div>
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Previous
                  </Button>
                  <Button type="button" className="flex-[2]" disabled={isLoading || !isStepThreeComplete} onClick={handleSubmit}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Submit for verification
                  </Button>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </main>
    </div>
  );
}
