"use client";

import { useEffect } from 'react';

// Declare the custom element for TypeScript to avoid "Property 'l-cardio' does not exist on type 'JSX.IntrinsicElements'"
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
  useEffect(() => {
    // Dynamically import the loader to avoid SSR (Server-Side Rendering) issues
    async function getLoader() {
      const { cardio } = await import('ldrs');
      cardio.register();
    }
    getLoader();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#FAF7F2]">
      {/* 
         Using your brand's Accent Gold (#C5A377) 
         for a luxurious, high-end feel 
      */}
      <l-cardio
        size="60"
        stroke="4"
        speed="2"
        color="#C5A377" 
      ></l-cardio>
    </div>
  );
}