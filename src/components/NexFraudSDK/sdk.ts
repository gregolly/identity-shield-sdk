
// Define the data structure for fingerprinting and behavior tracking
export interface NexFraudData {
  device: {
    fingerprint: string;
    userAgent: string;
    screenResolution: string;
    colorDepth: number;
    timezone: string;
    language: string;
    platform: string;
    plugins: string[];
    canvas: string;
    webGL: string;
    cpuCores: number;
  };
  network: {
    ip?: string;
    connectionType?: string;
  };
  behavior: {
    timeOnPage: number;
    mouseMovements: number;
    keyPresses: number;
    clicks: number;
    scrollPercentage: number;
    tabFocusChanges: number;
    lastActivity: Date;
  };
  session: {
    id: string;
    startTime: Date;
    referrer: string;
    pagesVisited: string[];
  };
  location: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
}

// Extend Window interface to include our SDK data
declare global {
  interface Window {
    nexFraudData: NexFraudData;
    nexFraudEventListeners: {
      mousemove: (e: MouseEvent) => void;
      click: (e: MouseEvent) => void;
      keydown: (e: KeyboardEvent) => void;
      scroll: (e: Event) => void;
      visibilitychange: (e: Event) => void;
    };
  }
}

// Generate a unique fingerprint for the device
const generateFingerprint = (): string => {
  const components: string[] = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    String(new Date().getTimezoneOffset()),
    String(navigator.hardwareConcurrency || 1),
    navigator.platform || '',
    String(screen.colorDepth),
  ];
  
  return components.join('###');
};

// Generate a simple canvas fingerprint
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'canvas-unsupported';
    
    canvas.width = 200;
    canvas.height = 50;
    
    // Text with different styles
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(10, 10, 100, 30);
    ctx.fillStyle = '#069';
    ctx.fillText('NexFraudSDK', 2, 15);
    
    return canvas.toDataURL().substring(0, 100);
  } catch (e) {
    return 'canvas-error';
  }
};

// Generate a simple WebGL fingerprint
const getWebGLInfo = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'webgl-unsupported';
    
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (info) {
      return gl.getParameter(info.UNMASKED_RENDERER_WEBGL).toString().substring(0, 100);
    }
    return 'webgl-limited-info';
  } catch (e) {
    return 'webgl-error';
  }
};

// Generate a session ID
const generateSessionId = (): string => {
  return 'nexfraud-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

// Create a new empty data structure
const createEmptyData = (): NexFraudData => ({
  device: {
    fingerprint: '',
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform || '',
    plugins: Array.from(navigator.plugins || []).map(p => p.name),
    canvas: '',
    webGL: '',
    cpuCores: navigator.hardwareConcurrency || 1,
  },
  network: {},
  behavior: {
    timeOnPage: 0,
    mouseMovements: 0,
    keyPresses: 0,
    clicks: 0,
    scrollPercentage: 0,
    tabFocusChanges: 0,
    lastActivity: new Date(),
  },
  session: {
    id: generateSessionId(),
    startTime: new Date(),
    referrer: document.referrer,
    pagesVisited: [window.location.href],
  },
  location: {},
});

// Track user behavior
const initBehaviorTracking = () => {
  const startTime = Date.now();
  let lastScrollTop = 0;
  
  // Create event handlers
  window.nexFraudEventListeners = {
    mousemove: (e: MouseEvent) => {
      window.nexFraudData.behavior.mouseMovements++;
      window.nexFraudData.behavior.lastActivity = new Date();
    },
    
    click: (e: MouseEvent) => {
      window.nexFraudData.behavior.clicks++;
      window.nexFraudData.behavior.lastActivity = new Date();
    },
    
    keydown: (e: KeyboardEvent) => {
      window.nexFraudData.behavior.keyPresses++;
      window.nexFraudData.behavior.lastActivity = new Date();
    },
    
    scroll: (e: Event) => {
      const docHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.offsetHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const trackLength = docHeight - winHeight;
      const scrollPercent = Math.floor((scrollTop / trackLength) * 100);
      
      window.nexFraudData.behavior.scrollPercentage = Math.max(
        window.nexFraudData.behavior.scrollPercentage,
        scrollPercent
      );
      window.nexFraudData.behavior.lastActivity = new Date();
    },
    
    visibilitychange: (e: Event) => {
      if (document.visibilityState === 'visible' || document.visibilityState === 'hidden') {
        window.nexFraudData.behavior.tabFocusChanges++;
      }
    },
  };
  
  // Register event listeners
  document.addEventListener('mousemove', window.nexFraudEventListeners.mousemove);
  document.addEventListener('click', window.nexFraudEventListeners.click);
  document.addEventListener('keydown', window.nexFraudEventListeners.keydown);
  document.addEventListener('scroll', window.nexFraudEventListeners.scroll);
  document.addEventListener('visibilitychange', window.nexFraudEventListeners.visibilitychange);
  
  // Update time on page periodically
  const timeInterval = setInterval(() => {
    window.nexFraudData.behavior.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);
  
  // Try to get geolocation if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.nexFraudData.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
      },
      () => {
        // Fail silently if user denies geolocation
      }
    );
  }
  
  // Cleanup function to remove event listeners
  return () => {
    document.removeEventListener('mousemove', window.nexFraudEventListeners.mousemove);
    document.removeEventListener('click', window.nexFraudEventListeners.click);
    document.removeEventListener('keydown', window.nexFraudEventListeners.keydown);
    document.removeEventListener('scroll', window.nexFraudEventListeners.scroll);
    document.removeEventListener('visibilitychange', window.nexFraudEventListeners.visibilitychange);
    clearInterval(timeInterval);
  };
};

// Main initialization function
export const initializeSDK = () => {
  console.log('Initializing NexFraud SDK...');
  
  // Create data structure if it doesn't exist
  if (!window.nexFraudData) {
    window.nexFraudData = createEmptyData();
  }
  
  // Populate fingerprints
  window.nexFraudData.device.fingerprint = generateFingerprint();
  window.nexFraudData.device.canvas = getCanvasFingerprint();
  window.nexFraudData.device.webGL = getWebGLInfo();
  
  // Initialize behavior tracking
  const cleanup = initBehaviorTracking();
  
  // Return cleanup function
  return cleanup;
};

// Function to manually verify identity
export const verifyIdentity = async (): Promise<any> => {
  try {
    const response = await fetch('/api/identity/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(window.nexFraudData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify identity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying identity:', error);
    throw error;
  }
};
