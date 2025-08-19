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
      console.log('[OneSignal] init called with appId', appId);
    });

    // Prompt using built-in browser prompt (via OneSignal) on first user gesture
    OneSignal.push(async function() {
      try {
        const getStatus = async () => {
          if (OneSignal.Notifications?.getPermissionStatus) {
            return await OneSignal.Notifications.getPermissionStatus();
          }
          return window.Notification?.permission || 'default';
        };

        const request = async () => {
          if (OneSignal.Notifications?.requestPermission) {
            return await OneSignal.Notifications.requestPermission();
          }
          if (window.Notification?.requestPermission) {
            return await window.Notification.requestPermission();
          }
        };

        const ensurePromptOnGesture = () => {
          const handler = async () => {
            try { await request(); } catch (_) {}
            window.removeEventListener('click', handler);
            window.removeEventListener('keydown', handler);
            window.removeEventListener('touchstart', handler);
          };
          window.addEventListener('click', handler, { once: true, passive: true });
          window.addEventListener('keydown', handler, { once: true });
          window.addEventListener('touchstart', handler, { once: true, passive: true });
        };

        const status = await getStatus();
        if (status === 'default' || status === 'prompt') {
          // Some browsers require a user gesture for the native prompt
          ensurePromptOnGesture();
        } else if (status === 'denied') {
          console.warn('[OneSignal] Permission denied by user/browser. User must enable in site settings.');
        }
      } catch (err) {
        console.warn('OneSignal permission setup failed:', err);
      }
    });
  } catch (error) {
    console.warn('OneSignal SDK failed to load or initialize:', error);
  }
}


