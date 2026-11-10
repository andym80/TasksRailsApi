'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import theme, { colors } from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: colors.ink, color: '#fff', borderRadius: 8, fontSize: 15 },
        }}
      />
      {children}
    </ThemeProvider>
  );
}
