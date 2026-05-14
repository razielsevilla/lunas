"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthView = "login" | "register";

interface AuthCardProps {
  initialView: AuthView;
  loginPanel: React.ReactNode;
  registerPanel: React.ReactNode;
}

export function AuthCard({ initialView, loginPanel, registerPanel }: AuthCardProps) {
  const router = useRouter();
  const [view, setView] = useState<AuthView>(initialView);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Only enable animation after first render to prevent flash on direct URL load
  useEffect(() => {
    setShouldAnimate(true);
  }, []);

  const switchTo = (next: AuthView) => {
    setView(next);
    router.push(next === "login" ? "/login" : "/register");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-0 md:p-4 font-sans">
      <div className="max-w-5xl w-full rounded-none md:rounded-[2rem] overflow-hidden shadow-none md:shadow-2xl min-h-screen md:min-h-[600px]">
        
        {/* Sliding track — double wide, clips to show one panel at a time */}
        <div
          className={shouldAnimate ? "transition-transform duration-500 ease-in-out" : ""}
          style={{
            display: "flex",
            width: "200%",
            height: "100%",
            transform: view === "login" ? "translateX(0)" : "translateX(-50%)",
          }}
        >
          {/* Login slot */}
          <div style={{ width: "50%", height: "100%" }}>
            {loginPanel}
          </div>

          {/* Register slot */}
          <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
            {registerPanel}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { AuthView };
