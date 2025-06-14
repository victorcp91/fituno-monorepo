import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

// Custom colors
const colors = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005E',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1E192B',
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#370B1E',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454E',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
  elevation: {
    level0: 'transparent',
    level1: '#F7F2F9',
    level2: '#F3EDF7',
    level3: '#EFE9F4',
    level4: '#EEE8F4',
    level5: '#ECE6F3',
  },
};

// Custom light theme
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    // Add custom fonts here if needed
  },
};

// Custom dark theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colors,
    background: '#1C1B1F',
    onBackground: '#E6E1E5',
    surface: '#1C1B1F',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033',
    elevation: {
      level0: 'transparent',
      level1: '#1E1B21',
      level2: '#211F24',
      level3: '#242227',
      level4: '#25232A',
      level5: '#27252D',
    },
  },
};

// Adapt themes for React Navigation
const { LightTheme: NavigationLight, DarkTheme: NavigationDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: lightTheme,
  materialDark: darkTheme,
});

export const CombinedDefaultTheme = {
  ...lightTheme,
  ...NavigationLight,
  colors: {
    ...lightTheme.colors,
    ...NavigationLight.colors,
  },
};

export const CombinedDarkTheme = {
  ...darkTheme,
  ...NavigationDark,
  colors: {
    ...darkTheme.colors,
    ...NavigationDark.colors,
  },
};

export type AppTheme = typeof CombinedDefaultTheme;
