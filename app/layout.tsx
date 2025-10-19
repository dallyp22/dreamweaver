import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WilderSeasons Edition Generator',
  description: 'Generate city-specific WilderSeasons editions in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

