// Create this file: src/services/googleAuth.service.js

class GoogleAuthService {
  constructor() {
    this.isInitialized = false;
    this.googleAuth = null;
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
      throw new Error('Google Client ID is not configured');
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    
    this.isInitialized = true;
  }

  handleCredentialResponse(response) {
    // This will be called when user completes Google sign-in
    // The response.credential contains the JWT token from Google
    console.log('Google credential response:', response);
  }

  async signInWithPopup() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const callback = (response) => {
        if (response.credential) {
          resolve(response.credential);
        } else {
          reject(new Error('No credential received from Google'));
        }
      };

      // Update the callback for this specific sign-in attempt
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Show the Google Sign-In popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google Sign-In was cancelled or not displayed'));
        }
      });
    });
  }

  parseJwtPayload(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Method to render Google Sign-In button (optional)
  renderButton(elementId, options = {}) {
    if (!this.isInitialized) {
      console.warn('Google Auth not initialized');
      return;
    }

    const defaultOptions = {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      text: 'signin_with',
      size: 'large',
      logo_alignment: 'left',
      ...options
    };

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      defaultOptions
    );
  }
}

export default new GoogleAuthService();