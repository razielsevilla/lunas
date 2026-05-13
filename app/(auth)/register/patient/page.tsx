"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  Lock,
  Stethoscope,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function PatientRegistration() {
  const router = useRouter();
  
  // UI State
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "+63",
    password: "",
    confirmPassword: "",
    dob: "",
    sex: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error when user types
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      // Success: Redirect to login with a success flag
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbf8f2]">
      {/* Left Column - Branding */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0f172a] p-12 lg:flex">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Your passport, your <br /> control
          </h2>
          <p className="mt-6 max-w-sm text-lg text-white/60 leading-relaxed">
            One QR code. Every clinician you trust. Audit log built in.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <main className="flex w-full flex-col p-8 md:p-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-200 to-amber-500" />
              <span className="text-xl font-bold text-[#0f172a]">Lunas</span>
            </div>
            <button 
              type="button"
              onClick={prevStep}
              className={cn(
                "flex items-center gap-1 text-sm font-medium text-[#8d8374] transition-all hover:text-[#1a1c1e]",
                step === 1 && "invisible"
              )}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold tracking-tight text-[#1a1c1e]">Patient registration</h1>
            <p className="mt-2 font-medium text-[#8d8374]">Step {step} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  i <= step ? "bg-[#1a1c1e]" : "bg-neutral-200"
                )} 
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-200 animate-in fade-in zoom-in-95">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* STEP 1: PERSONAL INFO */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Mobile Number</label>
                  <input name="mobile" value={formData.mobile} onChange={handleChange} type="tel" className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
                  <p className="text-[10px] text-[#8d8374]">Format: +639175550142</p>
                </div>
              </div>
            )}

            {/* STEP 2: DEMOGRAPHICS */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Date of Birth</label>
                  <input name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5">
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: SECURITY */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Password</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"} 
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#1a1c1e]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password" 
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5" 
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#1a1c1e] focus:ring-[#1a1c1e]" />
                  <p className="text-xs leading-relaxed text-[#8d8374]">
                    I agree to the <Link href="#" className="font-bold text-[#1a1c1e] underline">Terms of Service</Link> and <Link href="#" className="font-bold text-[#1a1c1e] underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6">
              <button 
                type="button"
                disabled={isLoading}
                onClick={step === 3 ? handleRegister : nextStep}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] py-4 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {step === 3 ? "Create Account" : "Continue"} 
                    {step === 3 ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </button>
              
              <p className="text-center text-sm text-[#8d8374]">
                Already have an account? <Link href="/login" className="font-bold text-[#1a1c1e]">Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}