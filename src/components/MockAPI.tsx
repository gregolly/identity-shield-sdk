
import React, { useEffect } from 'react';

// This component mocks the server-side API behavior for demo purposes
const MockAPI = () => {
  useEffect(() => {
    // Create a mock identity verification endpoint for our demo
    const mockVerifyEndpoint = async (request: any) => {
      // Parse the request body
      const data = await request.json();
      
      // Calculate a risk score based on the data received
      // This is a simplified version of what a real backend would do
      let score = 100; // Start with a perfect score
      
      // Check if we have behavior data
      if (!data.behavior || !data.device) {
        return {
          status: 'deny',
          score: 10,
          message: 'Missing critical data for verification',
          sessionId: data.session?.id || 'unknown-session',
        };
      }
      
      // Factor 1: Mouse movements (if too few, might be automated)
      if (data.behavior.mouseMovements < 10) {
        score -= 20;
      }
      
      // Factor 2: Time on page (if too short, might be suspicious)
      if (data.behavior.timeOnPage < 5) {
        score -= 15;
      }
      
      // Factor 3: User interactions (keypress, clicks)
      if (data.behavior.keyPresses === 0 && data.behavior.clicks === 0) {
        score -= 30;
      }
      
      // Add a bit of randomness for demo purposes
      const randomFactor = Math.floor(Math.random() * 20) - 10; // -10 to +10
      score = Math.max(0, Math.min(100, score + randomFactor));
      
      // Determine verification status based on score
      let status: 'allow' | 'review' | 'deny';
      let message: string;
      
      if (score >= 70) {
        status = 'allow';
        message = 'Verification successful. User behavior appears normal.';
      } else if (score >= 40) {
        status = 'review';
        message = 'Some unusual patterns detected. Additional verification recommended.';
      } else {
        status = 'deny';
        message = 'High risk activity detected. Access should be blocked.';
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        status,
        score,
        message,
        sessionId: data.session?.id || 'unknown-session',
      };
    };
    
    // Mock the server API endpoint
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (input === '/api/identity/verify') {
        try {
          // Convert body to any first to avoid type errors
          const response = await mockVerifyEndpoint(init?.body as any);
          return {
            ok: true,
            status: 200,
            json: async () => response,
          } as Response;
        } catch (error) {
          console.error('Error in mock verify endpoint:', error);
          return {
            ok: false,
            status: 500,
            json: async () => ({ error: 'Internal server error' }),
          } as Response;
        }
      }
      
      // Pass through to original fetch for all other requests
      return originalFetch(input, init);
    };
    
    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  // This component doesn't render anything, it just sets up the mock API
  return null;
};

export default MockAPI;
