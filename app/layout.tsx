import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
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
          <Nav />
        </Suspense>
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
