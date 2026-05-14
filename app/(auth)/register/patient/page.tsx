"use client";

import { useState, useMemo } from "react";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "", 
    password: "",
    confirmPassword: "",
    dob: "",
    sex: ""
  });

  // Updated Password Security: Letter and number required, special characters optional
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const forbiddenChars = /[\\'\";\s]/;

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "mobile") {
      const numbersOnly = value.replace(/\D/g, "");
      if (numbersOnly.length <= 10) {
        setFormData(prev => ({ ...prev, mobile: numbersOnly }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const formatMobileDisplay = (val: string) => {
    const m = val.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!m) return "";
    return `${m[1]}${m[2] ? " " + m[2] : ""}${m[3] ? " " + m[3] : ""}`.trim();
  };

  // Validation
  const isStep1Valid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      emailRegex.test(formData.email) &&
      formData.mobile.length === 10
    );
  }, [formData]);

  const isStep2Valid = useMemo(() => {
    return formData.dob !== "" && formData.sex !== "";
  }, [formData]);

  const isStep3Valid = useMemo(() => {
    return (
      passwordRegex.test(formData.password) &&
      !forbiddenChars.test(formData.password) &&
      formData.password === formData.confirmPassword
    );
  }, [formData]);

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid) {
      setError("Please check your password requirements.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Perform the Registration
      const regResponse = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mobile: `+63${formData.mobile}`,
        }),
      });

      const regData = await regResponse.json();
      if (!regResponse.ok) throw new Error(regData.error || "Registration failed.");

      // 2. Automatically Log In
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (loginResponse.ok) {
        // Redirect directly to dashboard
        router.push("/patient/dashboard");
      } else {
        // Fallback to login page if auto-login fails
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbf8f2]">
      {/* Branding */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0f172a] p-12 lg:flex">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 text-center">
          <div className="mb-8 mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-white">Your passport, your control</h2>
        </div>
      </div>

      {/* Form */}
      <main className="flex w-full flex-col p-8 md:p-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-200 to-amber-500" />
              <span className="text-xl font-bold text-[#0f172a]">Lunas</span>
            </div>
            <button type="button" onClick={prevStep} className={cn("text-sm font-medium text-[#8d8374]", step === 1 && "invisible")}>
              <ChevronLeft className="inline h-4 w-4" /> Back
            </button>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold text-[#1a1c1e]">Patient registration</h1>
            <p className="mt-2 text-[#8d8374]">Step {step} of 3</p>
          </div>

          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= step ? "bg-[#1a1c1e]" : "bg-neutral-200")} />
            ))}
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-[#8d8374]">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-[#8d8374]">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Mobile Number</label>
                  <div className="flex w-full items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                    <div className="bg-[#f9f9f9] px-5 py-4 text-sm font-bold">+63</div>
                    <input name="mobile" value={formatMobileDisplay(formData.mobile)} onChange={handleChange} type="tel" className="w-full px-5 py-4 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Date of Birth</label>
                  <input name="dob" value={formData.dob} onChange={handleChange} type="date" max={today} className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full rounded-2xl border border-neutral-200 px-5 py-4 text-sm outline-none">
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} className="w-full rounded-2xl border border-neutral-200 px-12 py-4 text-sm outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#8d8374]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirmPassword ? "text" : "password"} className="w-full rounded-2xl border border-neutral-200 px-12 py-4 text-sm outline-none" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100 grid grid-cols-2 gap-2">
                   <div className={cn("text-[10px] flex items-center gap-1", formData.password.length >= 8 ? "text-green-600" : "text-[#8d8374]")}>
                      <Check className="h-3 w-3" /> 8+ Chars
                   </div>
                   <div className={cn("text-[10px] flex items-center gap-1", passwordRegex.test(formData.password) ? "text-green-600" : "text-[#8d8374]")}>
                      <Check className="h-3 w-3" /> Alpha & Number
                   </div>
                   <div className={cn("text-[10px] flex items-center gap-1", !forbiddenChars.test(formData.password) && formData.password.length > 0 ? "text-green-600" : "text-[#8d8374]")}>
                      <Check className="h-3 w-3" /> No Quotes/Spaces
                   </div>
                   <div className={cn("text-[10px] flex items-center gap-1", formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 ? "text-green-600" : "text-[#8d8374]")}>
                      <Check className="h-3 w-3" /> Match
                   </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-6">
              <button 
                type="button"
                disabled={isLoading || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                onClick={step === 3 ? handleRegister : nextStep}
                className="w-full rounded-2xl bg-[#0f172a] py-4 text-sm font-bold text-white disabled:bg-neutral-200"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : <>{step === 3 ? "Create Account" : "Continue"} <ArrowRight className="inline h-4 w-4" /></>}
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