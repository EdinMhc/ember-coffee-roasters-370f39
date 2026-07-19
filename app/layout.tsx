import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/components/CartProvider';

export const metadata: Metadata = {
  title: 'Ember Coffee Roasters — Small-Batch Specialty Coffee',
  description:
    'Roasted in small batches. Shipped within 48 hours. Discover our carefully sourced single-origin coffees from Ethiopia, Colombia, Guatemala, and beyond.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
