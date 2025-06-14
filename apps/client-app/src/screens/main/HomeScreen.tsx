import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { StorageTest } from '../../components/StorageTest';

export function HomeScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">Welcome Back!</Text>
          <Text variant="bodyLarge" style={{ marginTop: 10 }}>
            Ready for today's workout?
          </Text>
        </Card.Content>
      </Card>

      {/* Temporary storage test component */}
      <StorageTest />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});
