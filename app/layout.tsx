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
            <div className="flex w-full items-center justify-between px-6 py-4">
              <a
                href="/planner"
                className="inline-flex items-center text-gray-700 hover:text-gray-900"
                aria-label="Personal Planner"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
                  <path d="M7 3.75V7" strokeLinecap="round" />
                  <path d="M17 3.75V7" strokeLinecap="round" />
                  <path d="M3.5 9.5H20.5" strokeLinecap="round" />
                  <path d="M8.2 15.2L10.4 17.4L15.8 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <nav className="flex items-center gap-4" />
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
