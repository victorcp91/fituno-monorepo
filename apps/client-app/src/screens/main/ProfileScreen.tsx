import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';

export function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {

    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Profile
      </Text>
      <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginVertical: 20 }}>
        {user?.email}
      </Text>
      <Button mode="contained" onPress={handleSignOut} style={styles.button}>
        Sign Out
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
  button: {
    width: '100%',
    marginTop: 10,
  },
});
