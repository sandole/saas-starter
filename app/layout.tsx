import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUser } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: "John's Plant Pots",
  description: 'Premium quality plant pots for your garden',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`bg-white text-black ${manrope.className}`}
    >
      <body className="min-h-[100dvh] flex flex-col">
        <UserProvider userPromise={userPromise}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}