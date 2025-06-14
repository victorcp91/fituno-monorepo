import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';

export function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { success, error: signInError } = await signIn(email, password);
      if (!success) {
        setError(signInError || 'Failed to sign in');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Login
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginVertical: 20 }}>
        Sign in to your account
      </Text>

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        disabled={isLoading}
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        disabled={isLoading}
        style={styles.input}
      />

      {error && <HelperText type="error">{error}</HelperText>}

      <Button
        mode="contained"
        onPress={handleSignIn}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Sign In
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/auth/forgot-password')}
        disabled={isLoading}
        style={styles.button}
      >
        Forgot Password?
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/auth/register')}
        disabled={isLoading}
        style={styles.button}
      >
        Don't have an account? Sign Up
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
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
});
