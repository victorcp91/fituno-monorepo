import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/providers/AuthProvider';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { storageService } from '../src/services';

export default function RootLayout() {
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
      <AuthProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
