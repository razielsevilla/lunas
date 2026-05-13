import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lunas',
  description: 'Lunas is an emergency medical information system for fast, secure access to patient data.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}