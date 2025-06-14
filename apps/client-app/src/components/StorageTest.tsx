import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { storageService } from '../services';

export const StorageTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runStorageTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    try {
      // Test AsyncStorage
      addResult('Testing AsyncStorage...');
      await storageService.setPreference('THEME_PREFERENCE', 'dark');
      const theme = await storageService.getThemePreference();
      addResult(`✅ AsyncStorage: Theme set to ${theme}`);

      // Test SecureStore
      addResult('Testing SecureStore...');
      await storageService.setAccessToken('test-token-123');
      const token = await storageService.getAccessToken();
      addResult(`✅ SecureStore: Token stored and retrieved: ${token?.substring(0, 10)}...`);

      // Test Database
      addResult('Testing SQLite Database...');
      const db = storageService.database;
      await db.insert('app_settings', {
        key: 'test_setting',
        value: 'test_value',
        updated_at: new Date().toISOString(),
      });
      const setting = await db.selectOne('app_settings', '*', 'key = ?', ['test_setting']);
      addResult(`✅ SQLite: Setting stored and retrieved: ${setting?.value}`);

      addResult('🎉 All storage tests passed!');
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTests = () => {
    setTestResults([]);
  };

  return (
    <Card style={styles.container}>
      <Card.Title title="Storage Test" />
      <Card.Content>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={runStorageTests}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Run Storage Tests
          </Button>
          <Button mode="outlined" onPress={clearTests} disabled={isLoading} style={styles.button}>
            Clear Results
          </Button>
        </View>

        <View style={styles.resultsContainer}>
          {testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
