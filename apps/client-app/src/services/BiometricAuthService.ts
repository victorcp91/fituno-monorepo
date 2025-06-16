import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import { storageService } from './StorageService';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricToken?: string;
}

export class BiometricAuthService {
  private static instance: BiometricAuthService;

  private constructor() {}

  public static getInstance(): BiometricAuthService {
    if (!BiometricAuthService.instance) {
      BiometricAuthService.instance = new BiometricAuthService();
    }
    return BiometricAuthService.instance;
  }

  // Check if biometric authentication is available
  public async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  // Get supported authentication types
  public async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported auth types:', error);
      return [];
    }
  }

  // Check if biometric authentication is enabled for the app
  public async isBiometricEnabled(): Promise<boolean> {
    try {
      const biometricKey = await storageService.getSecureItem('BIOMETRIC_KEY');
      return biometricKey !== null;
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  // Enable biometric authentication
  public async enableBiometric(userCredentials: {
    email: string;
    password: string;
  }): Promise<BiometricAuthResult> {
    try {
      // First check if biometric is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      // Authenticate with biometric to confirm setup
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || 'Biometric authentication failed',
        };
      }

      // Generate a unique biometric token
      const biometricToken = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${userCredentials.email}:${userCredentials.password}:${Date.now()}`,
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      // Store the biometric token securely
      await storageService.setSecureItem('BIOMETRIC_KEY', biometricToken);

      // Store encrypted credentials for biometric login
      const encryptedCredentials = await this.encryptCredentials(userCredentials, biometricToken);
      await storageService.setSecureObject('USER_CREDENTIALS', encryptedCredentials);

      return {
        success: true,
        biometricToken,
      };
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Disable biometric authentication
  public async disableBiometric(): Promise<void> {
    try {
      await Promise.all([
        storageService.removeSecureItem('BIOMETRIC_KEY'),
        storageService.removeSecureItem('USER_CREDENTIALS'),
      ]);
    } catch (error) {
      console.error('Error disabling biometric auth:', error);
      throw error;
    }
  }

  // Authenticate with biometric
  public async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    try {
      // Check if biometric is enabled
      const isEnabled = await this.isBiometricEnabled();
      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometric authentication is not enabled',
        };
      }

      // Perform biometric authentication
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || 'Biometric authentication failed',
        };
      }

      // Get the biometric token
      const biometricToken = await storageService.getSecureItem('BIOMETRIC_KEY');
      if (!biometricToken) {
        return {
          success: false,
          error: 'Biometric token not found',
        };
      }

      return {
        success: true,
        biometricToken,
      };
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get stored credentials after biometric authentication
  public async getStoredCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const biometricResult = await this.authenticateWithBiometric();
      if (!biometricResult.success || !biometricResult.biometricToken) {
        return null;
      }

      const encryptedCredentials = await storageService.getSecureObject<any>('USER_CREDENTIALS');
      if (!encryptedCredentials) {
        return null;
      }

      return await this.decryptCredentials(encryptedCredentials, biometricResult.biometricToken);
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      return null;
    }
  }

  // Get biometric authentication info
  public async getBiometricInfo(): Promise<{
    isAvailable: boolean;
    isEnabled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
    securityLevel?: LocalAuthentication.SecurityLevel;
  }> {
    try {
      const [isAvailable, isEnabled, supportedTypes] = await Promise.all([
        this.isAvailable(),
        this.isBiometricEnabled(),
        this.getSupportedTypes(),
      ]);

      let securityLevel: LocalAuthentication.SecurityLevel | undefined;
      if (isAvailable) {
        securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
      }

      return {
        isAvailable,
        isEnabled,
        supportedTypes,
        securityLevel,
      };
    } catch (error) {
      console.error('Error getting biometric info:', error);
      return {
        isAvailable: false,
        isEnabled: false,
        supportedTypes: [],
      };
    }
  }

  // Private helper methods
  private async encryptCredentials(
    credentials: { email: string; password: string },
    key: string
  ): Promise<any> {
    // Simple encryption using the biometric token as key
    // In production, use proper encryption libraries
    const data = JSON.stringify(credentials);
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${key}:${data}`,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    return {
      encrypted,
      timestamp: Date.now(),
    };
  }

  private async decryptCredentials(
    encryptedData: any,
    key: string
  ): Promise<{ email: string; password: string }> {
    try {
      // Basic implementation stub
      if (!encryptedData?.encrypted || !key) {
        throw new Error('Missing required parameters');
      }

      // TODO: Replace with proper encryption library
      const decodedData = atob(encryptedData.encrypted);
      const [_, data] = decodedData.split(':');

      if (!data) {
        throw new Error('Invalid encrypted data format');
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error decrypting credentials:', error);
      throw new Error('Credential decryption failed - use proper encryption library');
    }
  }
}
