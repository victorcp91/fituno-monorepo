import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export function OnboardingScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineLarge" style={{ color: theme.colors.onBackground }}>
        Welcome to Fituno
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginVertical: 20 }}>
        Your personal fitness journey starts here
      </Text>
      <Button mode="contained" onPress={() => {}}>
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
