import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/atkinson-hyperlegible-next';
import './globals.css';
import Providers from './providers';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Proyectos y tareas ordenados por fecha de vencimiento. Rails API + Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
