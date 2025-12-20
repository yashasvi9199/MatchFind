import { Capacitor } from '@capacitor/core';

/**
 * Returns true if running inside a native Capacitor shell (iOS/Android)
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Returns true if the platform is Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Returns true if running on the web (not native)
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};
