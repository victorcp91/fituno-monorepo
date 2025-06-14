import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../providers/AuthProvider';

export const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    user,
    isAuthenticated,
    isBiometricAvailable,
    isBiometricEnabled,
    signIn,
    signUp,
    signOut,
    enableBiometric,
    signInWithBiometric,
  } = useAuth();

  const handleSignUp = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await signUp(email, password, { full_name: 'Test User' });
      setMessage(result.success ? '✅ Sign up successful!' : `❌ ${result.error}`);
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await signIn(email, password);
      setMessage(result.success ? '✅ Sign in successful!' : `❌ ${result.error}`);
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      await signOut();
      setMessage('✅ Signed out successfully!');
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await enableBiometric({ email, password });
      setMessage(result.success ? '✅ Biometric enabled!' : `❌ ${result.error}`);
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await signInWithBiometric();
      setMessage(result.success ? '✅ Biometric sign in successful!' : `❌ ${result.error}`);
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Title title="Authentication Test" />
      <Card.Content>
        {/* Auth Status */}
        <View style={styles.statusContainer}>
          <Text variant="bodyMedium">
            Status: {isAuthenticated ? '🟢 Authenticated' : '🔴 Not Authenticated'}
          </Text>
          {user && <Text variant="bodySmall">User: {user.email}</Text>}
          <Text variant="bodySmall">Biometric Available: {isBiometricAvailable ? '✅' : '❌'}</Text>
          <Text variant="bodySmall">Biometric Enabled: {isBiometricEnabled ? '✅' : '❌'}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Credentials Input */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
        </View>

        {/* Auth Buttons */}
        <View style={styles.buttonContainer}>
          {!isAuthenticated ? (
            <>
              <Button
                mode="contained"
                onPress={handleSignUp}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                Sign Up
              </Button>
              <Button
                mode="contained"
                onPress={handleSignIn}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                Sign In
              </Button>
              {isBiometricEnabled && (
                <Button
                  mode="contained"
                  onPress={handleBiometricSignIn}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.button}
                  icon="fingerprint"
                >
                  Biometric Sign In
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                mode="outlined"
                onPress={handleSignOut}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                Sign Out
              </Button>
              {isBiometricAvailable && !isBiometricEnabled && (
                <Button
                  mode="contained"
                  onPress={handleEnableBiometric}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.button}
                  icon="fingerprint"
                >
                  Enable Biometric
                </Button>
              )}
            </>
          )}
        </View>

        {/* Message Display */}
        {message ? (
          <View style={styles.messageContainer}>
            <Text variant="bodySmall" style={styles.messageText}>
              {message}
            </Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 16,
  },
  button: {
    marginBottom: 4,
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
