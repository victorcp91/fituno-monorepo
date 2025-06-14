import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { useTheme } from 'react-native-paper';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL('/'), 'fituno://', 'https://fituno.app'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Auth: 'auth',
      Main: 'main',
    },
  },
};

export function AppNavigator() {
  const theme = useTheme();

  // TODO: Replace with actual auth state
  const isAuthenticated = false;
  const isOnboardingComplete = false;

  // Use the combined theme for navigation
  const navigationTheme = theme.dark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {!isOnboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
