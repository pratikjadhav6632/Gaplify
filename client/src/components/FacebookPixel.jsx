import { useEffect } from 'react';

const FacebookPixel = () => {
  useEffect(() => {
    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    // Get Facebook Pixel ID from Vite environment variable
    const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
    
    // Only initialize if pixelId is set
    if (pixelId && pixelId !== 'YOUR_PIXEL_ID_HERE') {
      fbq('init', pixelId);
      fbq('track', 'PageView');
    } else {
      console.warn('Facebook Pixel ID not configured. Please set VITE_FACEBOOK_PIXEL_ID in your .env file');
    }

    // Track page events
    const trackEvent = (eventName, eventData) => {
      fbq('track', eventName, eventData);
    };

    // Add event listeners for tracking
    const trackPageEvents = () => {
      // Track form submissions
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', () => {
          trackEvent('Lead');
        });
      });

      // Track button clicks
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          trackEvent('Click');
        });
      });
    };

    trackPageEvents();

    // Cleanup event listeners on unmount
    return () => {
      // Remove event listeners here if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FacebookPixel;
