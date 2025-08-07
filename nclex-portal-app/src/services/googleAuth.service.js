// 2. Update GoogleAuthService - src/services/googleAuth.service.js
class GoogleAuthService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve(true);
        return;
      }

      // Check if Google script is already loaded
      if (window.google && window.google.accounts) {
        this.initializeGoogleAuth();
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        try {
          this.initializeGoogleAuth();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'));
      };
      
      document.head.appendChild(script);
    });
  }

  initializeGoogleAuth() {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Google Client ID is not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env file');
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    
    this.isInitialized = true;
  }

  async signInWithPopup() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      // Set up callback for this specific sign-in attempt
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            resolve(response.credential); // This is the Google token ID
          } else {
            reject(new Error('No credential received from Google'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Trigger the Google Sign-In prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to One Tap if prompt is not shown
          reject(new Error('Google Sign-In was cancelled or not available'));
        }
      });
    });
  }

  // Helper method to decode Google JWT (for debugging)
  parseGoogleToken(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}

export default new GoogleAuthService();