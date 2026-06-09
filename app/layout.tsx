import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HSBC AI Launchpad — Concept Prototype',
  description:
    'The intelligence and financing platform helping SMEs adopt responsible AI. Concept prototype — not an official HSBC product.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
