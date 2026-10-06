/// <reference types="next" />

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'InstrumentsData',
  description: 'Registro de datos de instrumentos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}