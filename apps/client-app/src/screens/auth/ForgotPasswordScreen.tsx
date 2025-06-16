import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';

export function ForgotPasswordScreen() {
  const theme = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { success: resetSuccess, error: resetError } = await resetPassword(email);
      if (!resetSuccess) {
        setError(resetError || 'Failed to reset password');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Reset Password
      </Text>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onBackground, marginVertical: 20, textAlign: 'center' }}
      >
        {success
          ? 'Check your email for password reset instructions'
          : 'Enter your email address to receive password reset instructions'}
      </Text>

      {!success && (
        <>
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

          {error && <HelperText type="error">{error}</HelperText>}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Reset Password
          </Button>
        </>
      )}

      <Button
        mode="text"
        onPress={() => router.replace('/auth/login')}
        disabled={isLoading}
        style={styles.button}
      >
        Back to Login
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
