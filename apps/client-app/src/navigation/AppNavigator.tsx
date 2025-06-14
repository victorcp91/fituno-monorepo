import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { useTheme } from 'react-native-paper';

import { useAuth } from '../providers/AuthProvider';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'fituno://', 'https://fituno.app'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Auth: {
        screens: {
          Login: 'auth/login',
          Register: 'auth/register',
          ForgotPassword: 'auth/forgot-password',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Workouts: 'workouts',
          Progress: 'progress',
          Profile: 'profile',
        },
      },
    },
  },
};

export function AppNavigator() {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Get onboarding status from storage
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(false);

  React.useEffect(() => {
    // Load onboarding status from storage
    const loadOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('ONBOARDING_COMPLETED');
        setIsOnboardingComplete(status === 'true');
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      }
    };

    loadOnboardingStatus();
  }, []);

  // Show loading screen while checking auth state
  if (isLoading) {
    return null; // Or return a loading screen component
  }

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
