import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Types
export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

// Root Stack Types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Utility type to get the navigation prop type for a specific screen
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any; // We'll replace this with proper typing
  route: {
    key: string;
    name: T;
    params: RootStackParamList[T];
  };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: any; // We'll replace this with proper typing
  route: {
    key: string;
    name: T;
    params: AuthStackParamList[T];
  };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: any; // We'll replace this with proper typing
  route: {
    key: string;
    name: T;
    params: MainTabParamList[T];
  };
};
