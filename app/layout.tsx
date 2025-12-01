import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flip Royale - Web3 Card Game Waitlist',
  description: 'Join the waitlist for Flip Royale, the ultimate Web3 card game on Virtual Protocol. Choose your cards, earn points, and compete for weekly rewards.',
  keywords: ['Flip Royale', 'Web3', 'Card Game', 'Virtual Protocol', 'Crypto', 'NFT', 'Gaming'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
