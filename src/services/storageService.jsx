import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain from 'react-native-keychain';

class StorageService {
  // Secure storage for sensitive data like tokens
  async setSecureItem(key, value) {
    try {
      await Keychain.setInternetCredentials(key, key, value);
      return true;
    } catch (error) {
      console.error('Error storing secure item:', error);
      return false;
    }
  }

  async getSecureItem(key) {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  async removeSecureItem(key) {
    try {
      await Keychain.resetInternetCredentials(key);
      return true;
    } catch (error) {
      console.error('Error removing secure item:', error);
      return false;
    }
  }

  // Regular storage for non-sensitive data
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error storing item:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
