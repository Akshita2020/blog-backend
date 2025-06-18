import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial value from AsyncStorage
  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const item = await AsyncStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;

      setStoredValue(value);
    } catch (err) {
      console.error(`Error reading AsyncStorage key "${key}":`, err);
      setError(err);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    async value => {
      try {
        setError(null);

        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);

        return {success: true};
      } catch (err) {
        console.error(`Error setting AsyncStorage key "${key}":`, err);
        setError(err);
        return {success: false, error: err};
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(async () => {
    try {
      setError(null);

      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);

      return {success: true};
    } catch (err) {
      console.error(`Error removing AsyncStorage key "${key}":`, err);
      setError(err);
      return {success: false, error: err};
    }
  }, [key, initialValue]);

  const refreshValue = useCallback(async () => {
    await loadStoredValue();
  }, [loadStoredValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    refreshValue,
    loading,
    error,
    // For backward compatibility
    0: storedValue,
    1: setValue,
    2: removeValue,
  };
};

export default useAsyncStorage;
