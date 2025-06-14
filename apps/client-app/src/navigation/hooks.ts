import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

// Root Stack Navigation Hook
export const useRootNavigation = () =>
  useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();

// Auth Stack Navigation Hook
export const useAuthNavigation = () =>
  useRNNavigation<NativeStackNavigationProp<AuthStackParamList>>();

// Main Tab Navigation Hook
export const useMainNavigation = () =>
  useRNNavigation<NativeStackNavigationProp<MainTabParamList>>();

// Navigation Actions
export const useNavigationActions = () => {
  const rootNavigation = useRootNavigation();

  const navigateToAuth = () => rootNavigation.navigate('Auth', { screen: 'Login' });
  const navigateToMain = () => rootNavigation.navigate('Main', { screen: 'Home' });
  const navigateToOnboarding = () => rootNavigation.navigate('Onboarding');

  const resetToAuth = () =>
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Login' } }],
    });

  const resetToMain = () =>
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });

  return {
    navigateToAuth,
    navigateToMain,
    navigateToOnboarding,
    resetToAuth,
    resetToMain,
  };
};
