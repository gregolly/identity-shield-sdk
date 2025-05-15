
// Simplified NexFraud SDK for showcase purposes

// Core data structure
export interface SimplifiedNexFraudData {
  device: {
    fingerprint: string;
    browser: string;
    os: string;
    resolution: string;
    timezone: string;
  };
  behavior: {
    timeOnPage: number;
    mouseMovements: number;
    clicks: number;
    keyPresses: number;
  };
}

// Global declaration for TypeScript
declare global {
  interface Window {
    simplifiedNexFraud: {
      data: SimplifiedNexFraudData;
      initialized: boolean;
    };
  }
}

// Generate a simple device fingerprint
const generateFingerprint = (): string => {
  const components = [
    navigator.userAgent.replace(/\D+/g, ''),
    screen.width.toString() + screen.height.toString(),
    navigator.language,
    new Date().getTimezoneOffset().toString()
  ];
  
  return components.join('-').substring(0, 20);
};

// Get browser name
const getBrowserName = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "Internet Explorer";
  
  return "Unknown Browser";
};

// Get OS name
const getOSName = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf("Win") > -1) return "Windows";
  if (userAgent.indexOf("Mac") > -1) return "MacOS";
  if (userAgent.indexOf("Linux") > -1) return "Linux";
  if (userAgent.indexOf("Android") > -1) return "Android";
  if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) return "iOS";
  
  return "Unknown OS";
};

// Initialize data tracking
const initializeTracking = () => {
  // Initialize data structure if it doesn't exist
  if (!window.simplifiedNexFraud) {
    window.simplifiedNexFraud = {
      data: {
        device: {
          fingerprint: generateFingerprint(),
          browser: getBrowserName(),
          os: getOSName(),
          resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        behavior: {
          timeOnPage: 0,
          mouseMovements: 0,
          clicks: 0,
          keyPresses: 0,
        }
      },
      initialized: true
    };
  }
  
  // Set up event listeners for behavior tracking
  document.addEventListener('mousemove', () => {
    if (window.simplifiedNexFraud) {
      window.simplifiedNexFraud.data.behavior.mouseMovements++;
    }
  });
  
  document.addEventListener('click', () => {
    if (window.simplifiedNexFraud) {
      window.simplifiedNexFraud.data.behavior.clicks++;
    }
  });
  
  document.addEventListener('keydown', () => {
    if (window.simplifiedNexFraud) {
      window.simplifiedNexFraud.data.behavior.keyPresses++;
    }
  });
  
  // Update time on page every second
  const startTime = Date.now();
  setInterval(() => {
    if (window.simplifiedNexFraud) {
      window.simplifiedNexFraud.data.behavior.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    }
  }, 1000);
};

// Main SDK initialization function
export const initializeSimplifiedSDK = (): void => {
  console.log("Initializing Simplified NexFraud SDK...");
  initializeTracking();
};

// Verify identity function
export const verifyIdentity = async (): Promise<{
  status: 'allow' | 'review' | 'deny';
  score: number;
  message: string;
}> => {
  // We'll simulate an API call and risk calculation
  const data = window.simplifiedNexFraud?.data;
  
  // Simple risk scoring algorithm for demo purposes
  let score = 100; // Start with perfect score
  
  // Check behavior metrics
  if (data?.behavior.mouseMovements < 5) score -= 30;
  if (data?.behavior.clicks < 1) score -= 20;
  if (data?.behavior.timeOnPage < 5) score -= 15;
  
  // Add some randomness for demo purposes
  const randomFactor = Math.floor(Math.random() * 20) - 5;
  score = Math.max(0, Math.min(100, score + randomFactor));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return result based on score
  if (score >= 70) {
    return {
      status: 'allow',
      score,
      message: 'User verification successful',
    };
  } else if (score >= 40) {
    return {
      status: 'review',
      score,
      message: 'Additional verification recommended',
    };
  } else {
    return {
      status: 'deny',
      score,
      message: 'High risk activity detected',
    };
  }
};
