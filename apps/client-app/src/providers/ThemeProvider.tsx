import React from 'react';
import { useColorScheme } from 'react-native';
import { MD3Theme, PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme } from '../theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return <PaperProvider theme={theme as MD3Theme}>{children}</PaperProvider>;
}
