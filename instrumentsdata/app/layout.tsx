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
      <head>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f4f4f5;
            color: #18181b;
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}