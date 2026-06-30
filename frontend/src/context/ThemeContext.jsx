import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeConfig } from '../theme/theme';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark'); // Default to dark mode for visual impact

  useEffect(() => {
    const savedMode = localStorage.getItem('theme_mode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme_mode', nextMode);
          return nextMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => themeConfig(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
export default ColorModeContext;
