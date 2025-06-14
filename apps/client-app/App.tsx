import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { storageService } from './src/services';

export default function App() {
  useEffect(() => {
    // Initialize storage service on app startup
    const initializeStorage = async () => {
      try {
        await storageService.initialize();
        console.log('Storage service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize storage service:', error);
      }
    };

    initializeStorage();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
