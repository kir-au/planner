import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import ProvidersWrapper from './providers-wrapper'

export const metadata = {
  title: 'CubCar',
  description:
    'Rides for the kids.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Suspense>
          <header className="w-full border-b">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <a href="/planner" className="text-lg font-semibold tracking-tight">
                Personal Planner
              </a>
              <nav className="flex items-center gap-4">
                <a href="/planner" className="text-sm font-medium hover:underline">Planner</a>
              </nav>
            </div>
          </header>
        </Suspense>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
