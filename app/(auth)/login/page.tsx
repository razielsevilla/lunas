"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight,
  Stethoscope,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Successful Login: Redirect based on role returned by your API
      if (data.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else if (data.role === "PROFESSIONAL") {
        router.push("/professional/dashboard");
      } else {
        router.push("/admin/overview");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbf8f2]">
      {/* Left Column - Form */}
      <main className="flex w-full flex-col p-8 md:p-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-200 to-amber-500" />
            <span className="text-xl font-bold text-[#0f172a]">Lunas</span>
          </div>

          <div className="mt-20">
            <h1 className="text-5xl font-bold tracking-tight text-[#1a1c1e]">Sign In</h1>
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
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-12 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1a1c1e]/5 transition-all" 
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
                <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] py-4 text-sm font-bold text-white transition-all hover:bg-[#1e293b] active:scale-[0.98] disabled:bg-neutral-400"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Access Portal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs font-medium text-[#8d8374]">
              New here? <Link href="/register/patient" className="font-bold text-[#1a1c1e]">Create an account</Link> · <Link href="#" className="text-neutral-400 hover:text-[#1a1c1e]">Admin sign in</Link>
            </p>
          </form>
        </div>
      </main>

      {/* Right Column - Branding */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0f172a] p-12 lg:flex">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Join Lunas</h2>
          <p className="mt-6 max-w-xs text-lg text-white/60 leading-relaxed">
            Be part of a safer, smarter way to carry your medical record.
          </p>
          <Link 
            href="/register/patient" 
            className="mt-10 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}