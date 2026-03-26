import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ConfirmedClient } from './ConfirmedClient';

export const metadata: Metadata = {
  title: 'Booking Confirmed · Crelyzor',
  description: 'Your meeting is confirmed.',
};

export default function ConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedClient />
    </Suspense>
  );
}
