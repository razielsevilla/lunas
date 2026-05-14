"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight,
  Stethoscope,
  Loader2,
  AlertCircle,
  HeartPulse
} from "lucide-react";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const switchToRegister = () => router.push("/register");
  const switchToLogin = () => router.push("/login");

  return (
    <AuthCard
      initialView="login"
      loginPanel={<LoginForm onSwitchToRegister={switchToRegister} />}
      registerPanel={<RegisterPageComponent onSwitchToLogin={switchToLogin} />}
    />
  );
}

// RegisterPageComponent for use in AuthCard
function RegisterPageComponent({ onSwitchToLogin }: { onSwitchToLogin?: () => void }) {
  return (
    <div className="flex w-full h-full bg-white items-stretch font-sans">
        
        {/* Left Section: Branding & Pattern — hidden on mobile, shown on lg+ */}
        <div className="relative hidden w-1/2 bg-[#001F2D] p-12 lg:flex flex-col items-center justify-center text-center text-white overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }}
          />
          
          <div className="relative z-10">
            <div className="bg-white/10 p-4 rounded-2xl inline-block mb-8 backdrop-blur-sm border border-white/10">
              <Stethoscope size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">
              Welcome to Lunas
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto">
              A secure medical passport for patients and the professionals who care for them.
            </p>
          </div>
        </div>

        {/* Right Section: Role Selection */}
        <div className="w-full p-6 md:p-12 lg:w-1/2 flex flex-col">
          <div className="flex justify-start items-center mb-10 md:mb-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-100 rounded-full transform translate-x-1" />
              </div>
              <span className="text-2xl font-display font-bold text-[#001F2D]">Lunas</span>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center mx-auto w-full max-w-md">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#001F2D] mb-2">
              Choose your role
            </h2>
            <p className="text-slate-500 mb-10">
              Personalize your Lunas experience.
            </p>

            <div className="space-y-4">
              {/* Patient Option Link */}
              <Link href="/register/patient" className="block">
                <button className="w-full group flex items-center p-6 bg-[#FAF9F6] border border-slate-100 rounded-3xl hover:border-slate-300 hover:shadow-md transition-all text-left">
                  <div className="bg-[#EFEDE8] p-4 rounded-2xl mr-5">
                    <HeartPulse className="text-slate-700" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display font-bold text-lg text-[#001F2D]">Patient</h3>
                    <p className="text-sm text-slate-500">Carry your medical record. Share it instantly when it matters.</p>
                  </div>
                  <ArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>

              {/* Medical Expert Option Link */}
              <Link href="/register/professional" className="block">
                <button className="w-full group flex items-center p-6 bg-[#FAF9F6] border border-slate-100 rounded-3xl hover:border-slate-300 hover:shadow-md transition-all text-left">
                  <div className="bg-[#EFEDE8] p-4 rounded-2xl mr-5">
                    <Stethoscope className="text-slate-700" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display font-bold text-lg text-[#001F2D]">Medical Expert</h3>
                    <p className="text-sm text-slate-500">Verified access to patient records in clinical and emergency settings.</p>
                  </div>
                  <ArrowRight className="text-slate-400 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Sign In Button */}
          {onSwitchToLogin && (
            <div className="pt-8 border-t border-slate-200">
              <p className="text-center text-sm font-medium text-slate-500 mb-4">
                Already have an account?
              </p>
              <button 
                onClick={onSwitchToLogin}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-8 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    );
}

function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresPin, setRequiresPin] = useState(false);
  const [pin, setPin] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requiresPin ? { ...formData, pin } : formData),
      });

      const data = await response.json();

      if (response.status === 403 && data.requiresPin) {
        setRequiresPin(true);
        setError(null);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Successful Login: Redirect based on role returned by your API
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else if (data.role === "PROFESSIONAL") {
        router.push("/professional/dashboard");
      } else {
        router.push("/overview");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full bg-white font-sans">
      {/* Left Column - Form */}
      <main className="flex w-full flex-col p-8 md:p-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-2">
            <img 
              src="/logo/lunas-logo.png" 
              alt="Lunas Logo" 
              width="32" 
              height="32"
              className="object-contain"
            />
            <span className="text-xl font-bold text-[#0f172a] font-display">Lunas</span>
          </div>

          <div className="mt-20">
            <h1 className="text-5xl font-display font-bold tracking-tight text-[#1a1c1e]">Sign In</h1>
            <p className="mt-3 text-lg font-medium text-[#8d8374]">Enter your portal credentials</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-200 animate-in fade-in zoom-in-95">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form className="mt-12 space-y-6" onSubmit={handleLogin}>
            {requiresPin ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="pt-2">
                  <p className="text-sm font-semibold text-[#1a1c1e] mb-4 text-center">Medical Access PIN</p>
                  <label htmlFor="pin-input" className="flex justify-center space-x-3 cursor-pointer">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-colors ${
                          i < pin.length
                            ? 'bg-[#1a1c1e] text-white border-[#1a1c1e] shadow-md'
                            : 'border-neutral-300 text-transparent hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {i < pin.length ? '●' : ''}
                      </div>
                    ))}
                  </label>
                  <input
                    id="pin-input"
                    type="text"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="sr-only"
                    maxLength={6}
                    autoFocus
                  />
                  <p className="text-center text-[11px] text-[#8d8374] mt-4">Please verify your identity to access the portal.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Email</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input 
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@clinic.com"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8d8374]">Password</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5 transition-all [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#1a1c1e]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Link href="/contact" className="text-[11px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={isLoading || (requiresPin && pin.length !== 6)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] py-4 text-sm font-bold text-white transition-all hover:bg-[#1e293b] active:scale-[0.98] disabled:bg-neutral-400"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {requiresPin ? "Verify PIN" : "Access Portal"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            
            <p className="text-center text-sm font-medium text-[#8d8374]">
              New here? <button type="button" onClick={onSwitchToRegister} className="font-bold text-[#1a1c1e] hover:underline">Create an account</button>
            </p>
          </form>
        </div>
      </main>

      {/* Right Column - Branding */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0B1120] p-12 lg:flex">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-display font-bold tracking-tight text-white leading-tight">Join Lunas</h2>
          <p className="mt-6 max-w-xs text-lg text-white/60 leading-relaxed">
            Be part of a safer, smarter way to carry your medical record.
          </p>
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="mt-10 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}