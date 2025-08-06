// src/hooks/useLocalStorage.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @param {Object} options - Configuration options
 * @returns {[any, Function, Function]} - [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncData = true,
    raw = false,
  } = options;

  // Get initial value from localStorage or use provided initial value
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      if (raw) {
        return item;
      }
      
      return deserialize(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize, raw]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available');
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state
      setStoredValue(valueToStore);
      
      // Update localStorage
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        const serializedValue = raw ? valueToStore : serialize(valueToStore);
        window.localStorage.setItem(key, serializedValue);
      }
      
      // Dispatch storage event for other tabs/windows
      if (syncData) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: raw ? valueToStore : serialize(valueToStore),
            url: window.location.href,
            storageArea: window.localStorage,
          })
        );
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, serialize, raw, syncData]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      // Dispatch storage event for other tabs/windows
      if (syncData) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            url: window.location.href,
            storageArea: window.localStorage,
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncData]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    if (!syncData || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key !== key || e.storageArea !== window.localStorage) {
        return;
      }

      try {
        if (e.newValue === null) {
          setStoredValue(initialValue);
        } else {
          const newValue = raw ? e.newValue : deserialize(e.newValue);
          setStoredValue(newValue);
        }
      } catch (error) {
        console.error(`Error syncing localStorage key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, deserialize, raw, syncData]);

  // Update localStorage if key changes
  useEffect(() => {
    const currentValue = getStoredValue();
    if (currentValue !== storedValue) {
      setValue(currentValue);
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue, removeValue];
};

/**
 * Custom hook for managing sessionStorage with React state
 * Works exactly like useLocalStorage but uses sessionStorage instead
 */
export const useSessionStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    raw = false,
  } = options;

  // Get initial value from sessionStorage or use provided initial value
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      if (raw) {
        return item;
      }
      
      return deserialize(item);
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize, raw]);

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update sessionStorage when value changes
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn('sessionStorage is not available');
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state
      setStoredValue(valueToStore);
      
      // Update sessionStorage
      if (valueToStore === undefined || valueToStore === null) {
        window.sessionStorage.removeItem(key);
      } else {
        const serializedValue = raw ? valueToStore : serialize(valueToStore);
        window.sessionStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue, serialize, raw]);

  // Remove value from sessionStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};