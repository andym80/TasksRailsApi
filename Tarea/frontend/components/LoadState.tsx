'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { API_URL } from '@/lib/api';

export function LoadError({ what, onRetry }: { what: string; onRetry: () => void }) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Reintentar
        </Button>
      }
    >
      No se pudieron cargar {what}. La API en {API_URL} no responde: verificá que el backend esté corriendo.
    </Alert>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Box aria-busy="true" aria-label="Cargando" sx={{ display: 'grid', gap: 1 }}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={56} />
      ))}
    </Box>
  );
}
