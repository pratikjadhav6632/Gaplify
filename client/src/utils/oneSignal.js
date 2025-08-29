// OneSignal Web Push initialization utility
// Loads the OneSignal SDK, registers the service worker, and prompts for permission

const loadOneSignalScript = () => {
  return new Promise((resolve, reject) => {
    if (window.OneSignal) {
      resolve(window.OneSignal);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
    script.async = true;
    script.onload = () => resolve(window.OneSignal);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export async function initOneSignal() {
  try {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
    if (!appId) {
      console.warn('VITE_ONESIGNAL_APP_ID is not set. Skipping OneSignal init.');
      return;
    }

    await loadOneSignalScript();
    
    // Initialize OneSignal with your app ID
    window.OneSignal = window.OneSignal || [];
    
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // This will be called when OneSignal is ready
    window.OneSignal.push(async function() {
      try {
        // Wait for OneSignal to be fully initialized
        if (!window.OneSignal.Notifications) {
          console.warn('OneSignal not fully loaded yet');
          return;
        }
        
        // Enable debug logging in development
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isDevelopment && window.OneSignal.setLogLevel) {
          try {
            window.OneSignal.setLogLevel({ display: true, debug: true });
          } catch (e) {
            console.warn('Could not set OneSignal log level:', e);
          }
        }
        
        console.log('OneSignal SDK is ready');

        // Initialize OneSignal with the app ID
        await window.OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: false }
        });

        console.log('[OneSignal] Initialized with appId:', appId);

        // Check if user is already subscribed
        const isSupported = await window.OneSignal.Notifications.isPushSupported();
        
        if (isSupported) {
          console.log('Push notifications are supported');
          // Check current subscription state
          const permission = await window.OneSignal.Notifications.getPermission();
          console.log('Notification permission state:', permission);
          
          // If not subscribed, show the native prompt
          if (permission === 'default') {
            // Use a button click or other user gesture to show the prompt
            const showPrompt = () => {
              window.OneSignal.Notifications.requestPermission()
                .then(accepted => {
                  console.log('Notification permission:', accepted ? 'granted' : 'denied');
                })
                .catch(error => {
                  console.error('Error requesting notification permission:', error);
                });
            };
            
            // Show prompt after a short delay to ensure OneSignal is fully initialized
            setTimeout(showPrompt, 1000);
          }
        } else {
          console.warn('Push notifications are not supported in this browser');
        }
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
      }
    });
  } catch (error) {
    console.warn('OneSignal SDK failed to load or initialize:', error);
  }
}
