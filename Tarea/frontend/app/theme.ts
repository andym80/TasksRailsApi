'use client';

import { createTheme } from '@mui/material/styles';

export const colors = {
  paper: '#F4F6F3',
  surface: '#FFFFFF',
  ink: '#16211D',
  muted: '#54635C',
  line: '#DCE3DE',
  viridian: '#0E6B55',
  viridianDark: '#0A5241',
  viridianWash: '#E3F0EB',
  blue: '#1D5FA8',
  amber: '#A8500B',
  red: '#B3261E',
};

const display = "'Bricolage Grotesque Variable', 'Atkinson Hyperlegible Next Variable', system-ui, sans-serif";
const body = "'Atkinson Hyperlegible Next Variable', system-ui, -apple-system, 'Segoe UI', sans-serif";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.viridian, dark: colors.viridianDark, contrastText: '#FFFFFF' },
    secondary: { main: colors.blue },
    error: { main: colors.red },
    warning: { main: colors.amber },
    background: { default: colors.paper, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.muted },
    divider: colors.line,
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: body,
    fontSize: 15,
    h1: { fontFamily: display, fontWeight: 650, fontSize: '2.5rem', lineHeight: 1.1, letterSpacing: '-0.02em' },
    h2: { fontFamily: display, fontWeight: 650, fontSize: '1.375rem', lineHeight: 1.25, letterSpacing: '-0.01em' },
    h3: { fontFamily: display, fontWeight: 600, fontSize: '1.0625rem', lineHeight: 1.3 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, paddingInline: 16 } },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 14, border: `1px solid ${colors.line}` } } },
    MuiDialogTitle: { styleOverrides: { root: { fontFamily: display, fontWeight: 650, fontSize: '1.375rem' } } },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: colors.muted,
          borderColor: colors.line,
          paddingBlock: 6,
          paddingInline: 14,
          '&.Mui-selected': { color: colors.viridianDark, backgroundColor: colors.viridianWash },
          '&.Mui-selected:hover': { backgroundColor: colors.viridianWash },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { height: 6, borderRadius: 3, backgroundColor: colors.line }, bar: { borderRadius: 3 } },
    },
  },
});

export default theme;
