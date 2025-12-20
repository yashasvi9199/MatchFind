import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { isAndroid } from './platform';

interface BackButtonOptions {
  /**
   * Callback when back button is pressed.
   * Return `true` to indicate the event was handled (prevents default behavior).
   * Return `false` to allow default behavior (app closes).
   */
  onBack: () => boolean;
}

/**
 * Hook to handle Android hardware back button.
 * Only active on Android platform.
 */
export function useAndroidBackButton({ onBack }: BackButtonOptions) {
  useEffect(() => {
    // Only register on Android
    if (!isAndroid()) return;

    const handleBackButton = App.addListener('backButton', ({ canGoBack }) => {
      // Try our custom handler first
      const handled = onBack();
      
      // If not handled and browser can go back, let it
      if (!handled && canGoBack) {
        window.history.back();
      }
      // If not handled and can't go back, app will close (default behavior)
    });

    return () => {
      handleBackButton.then(listener => listener.remove());
    };
  }, [onBack]);
}
