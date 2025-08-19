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

    const OneSignal = await loadOneSignalScript();
    // Ensure OneSignal array exists (compat with older SDK async init pattern)
    window.OneSignal = window.OneSignal || [];

    // Initialize OneSignal SDK
    OneSignal.push(function() {
      OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
        // Explicitly set service worker files and scope
        serviceWorkerParam: { scope: '/' },
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js'
      });
    });

    // Prompt for push permission if not already granted or denied
    OneSignal.push(async function() {
      try {
        const permission = await OneSignal.Notifications.getPermissionStatus?.();
        if (permission === 'default' || permission === 'prompt') {
          if (OneSignal.Slidedown?.promptPush) {
            await OneSignal.Slidedown.promptPush();
          } else if (OneSignal.showSlidedownPrompt) {
            await OneSignal.showSlidedownPrompt();
          } else if (OneSignal.Notifications?.requestPermission) {
            await OneSignal.Notifications.requestPermission();
          }
        }
      } catch (err) {
        console.warn('OneSignal permission prompt failed:', err);
      }
    });
  } catch (error) {
    console.warn('OneSignal SDK failed to load or initialize:', error);
  }
}


