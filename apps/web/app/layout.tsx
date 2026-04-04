import './globals.css';
import type { Metadata } from 'next';
import { UserChip } from '../components/user-chip';

export const metadata: Metadata = {
  title: 'Yokohama CRM',
  description: 'CRM operativo para Yokohama',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        <div className="fixed right-4 top-4 z-50 hidden lg:block">
          <UserChip />
        </div>
        {children}
      </body>
    </html>
  );
}
