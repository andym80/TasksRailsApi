'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { colors } from '@/app/theme';

const LINKS = [
  { href: '/', label: 'Agenda' },
  { href: '/projects', label: 'Proyectos' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: colors.paper,
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <Container
          maxWidth="md"
          sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 4 }, height: 60 }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              fontFamily: "'Bricolage Grotesque Variable', sans-serif",
              fontWeight: 700,
              fontSize: '1.125rem',
              letterSpacing: '-0.01em',
              color: colors.ink,
              textDecoration: 'none',
            }}
          >
            Task Manager
          </Box>
          <Box component="nav" aria-label="Secciones" sx={{ display: 'flex', gap: 0.5, height: '100%' }}>
            {LINKS.map((link) => (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isCurrent(link.href) ? colors.viridianDark : colors.muted,
                  boxShadow: isCurrent(link.href) ? `inset 0 -3px 0 ${colors.viridian}` : 'none',
                  '&:hover': { color: colors.ink },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, sm: 5 }, pb: 12 }}>
        {children}
      </Container>
    </>
  );
}
