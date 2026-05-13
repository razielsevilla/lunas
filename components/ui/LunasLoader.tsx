"use client";

import { useEffect, useState } from 'react';

/**
 * Declare the custom element for TypeScript to avoid "Property 'l-cardio' does not exist on type 'JSX.IntrinsicElements'"
 */
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'l-cardio': {
          size?: string | number;
          color?: string | number;
          speed?: string | number;
          stroke?: string | number;
          'bg-opacity'?: string | number;
        };
      }
    }
  }
}

export default function LunasLoader() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Dynamically import the loader to avoid SSR (Server-Side Rendering) issues
    async function getLoader() {
      try {
        const { cardio } = await import('ldrs');
        cardio.register();
      } catch (error) {
        // Silently fail or log for debugging
        console.warn('LunasLoader animation failed to register:', error);
      }
    }
    getLoader();

    // Reveal text right as the pulse finishes its first cycle.
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-transparent">
      {/* 
        Container ensures the cardio line and text 
        stay vertically aligned and centered.
      */}
      <div className="relative flex flex-col items-center justify-center h-48 w-48">
        <l-cardio
          size="64"
          stroke="4"
          speed="2"
          color="#C5A377" 
        ></l-cardio>

        {/* 
          Lunas Brand Text 
          Uses a smooth CSS transition to fade in and slide up slightly 
          after the timeout triggers.
        */}
        <div 
          className={`absolute bottom-6 flex items-center justify-center transition-all duration-1000 ease-out
            ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <h2 className="font-serif text-[1.75rem] font-bold tracking-tight text-[#0C0E14]">
            Lunas
          </h2>
        </div>
      </div>
    </div>
  );
}
