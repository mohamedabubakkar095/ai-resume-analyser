import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          // Dark Mode Color Palette
          primary: {
            main: '#a78bfa',      // Violet-300
            light: '#c084fc',     // Purple-400
            dark: '#7c3aed',      // Violet-600
            contrastText: '#0f172a',
          },
          secondary: {
            main: '#34d399',      // Emerald-300
            light: '#6ee7b7',
            dark: '#059669',
            contrastText: '#0f172a',
          },
          background: {
            default: '#070a13',   // Custom deep dark space background
            paper: '#0f172a',     // Card slate-900 background
          },
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
          },
          divider: 'rgba(148, 163, 184, 0.12)',
        }
      : {
          // Light Mode Color Palette
          primary: {
            main: '#6d28d9',      // Violet-700
            light: '#8b5cf6',     // Violet-500
            dark: '#4c1d95',      // Violet-900
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#10b981',      // Emerald-500
            light: '#34d399',
            dark: '#047857',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f8fafc',   // Soft cool slate
            paper: '#ffffff',     // Plain white
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
          },
          divider: 'rgba(15, 23, 42, 0.08)',
        }),
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 12,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' 
            : 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
          color: '#ffffff',
          '&:hover': {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)' 
              : 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: mode === 'dark' 
            ? '0 4px 30px rgba(0, 0, 0, 0.4)' 
            : '0 4px 30px rgba(15, 23, 42, 0.05)',
          backdropFilter: 'blur(5px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export const themeConfig = (mode) => createTheme(getDesignTokens(mode));
