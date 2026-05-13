"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, AlertTriangle } from "lucide-react";

// ---------------------------------------------------------------------------
// LogoutButton — shared across Patient, Professional, and Admin layouts.
//
// Flow:
//   1. User clicks "Log Out"
//   2. Confirm dialog appears
//   3. User confirms → loading spinner shows
//   4. POST /api/auth/logout → clears session cookie
//   5. Redirect to "/" (landing page)
// ---------------------------------------------------------------------------

interface LogoutButtonProps {
  /** Visual variant: "sidebar" (white text on dark) or "admin" (white text on dark sidebar) */
  variant?: "sidebar" | "admin";
  className?: string;
}

export function LogoutButton({ variant = "sidebar", className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      // Hard navigation to clear all client state
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShowConfirm(true)}
        className={`group flex w-full items-center gap-4 px-4 py-3 text-sm font-medium transition-all text-white/60 hover:text-white ${className}`}
      >
        <LogOut className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
        <span>Log Out</span>
      </button>

      {/* Confirm dialog + loading overlay */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
            {isLoading ? (
              /* Loading state */
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <Loader2 className="h-7 w-7 animate-spin text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Signing you out…</p>
                <p className="text-xs text-slate-400">Please wait a moment.</p>
              </div>
            ) : (
              /* Confirm state */
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                    <AlertTriangle className="h-7 w-7 text-amber-500" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Sign out?</h2>
                  <p className="text-sm text-slate-500">
                    You'll be signed out of your Lunas account and redirected to the home page.
                  </p>
                  {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => { setShowConfirm(false); setError(null); }}
                    className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-xl bg-[#0f172a] py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 active:scale-[0.98]"
                  >
                    Yes, sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
