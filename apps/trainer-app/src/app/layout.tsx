import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '../lib/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Fituno - Personal Trainer App',
    template: '%s | Fituno',
  },
  description:
    'Aplicativo completo para personal trainers gerenciarem clientes, treinos e acompanhamento.',
  keywords: ['personal trainer', 'fitness', 'treino', 'academia', 'exercícios'],
  authors: [{ name: 'Fituno Team' }],
  creator: 'Fituno',
  metadataBase: new URL('https://fituno.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fituno.app',
    title: 'Fituno - Personal Trainer App',
    description:
      'Aplicativo completo para personal trainers gerenciarem clientes, treinos e acompanhamento.',
    siteName: 'Fituno',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fituno - Personal Trainer App',
    description:
      'Aplicativo completo para personal trainers gerenciarem clientes, treinos e acompanhamento.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
