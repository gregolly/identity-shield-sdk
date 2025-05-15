
import React, { useEffect, useState } from 'react';
import { initializeSDK } from './sdk';
import DeviceInfo from './DeviceInfo';
import UserBehavior from './UserBehavior';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export interface SDKResult {
  status: 'allow' | 'review' | 'deny';
  score: number;
  message: string;
  sessionId: string;
}

const NexFraudSDK = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [result, setResult] = useState<SDKResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the SDK when component mounts
    initializeSDK();
    setIsInitialized(true);
  }, []);

  const verifyUser = async () => {
    setLoading(true);
    setError(null);
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
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!result) return <Shield className="h-8 w-8 text-blue-500" />;
    
    switch (result.status) {
      case 'allow':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'review':
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case 'deny':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Shield className="h-8 w-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return 'bg-blue-50';
    
    switch (result.status) {
      case 'allow':
        return 'bg-green-50';
      case 'review':
        return 'bg-amber-50';
      case 'deny':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className={`${getStatusColor()} transition-colors duration-300`}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle>NexFraud SDK Demo</CardTitle>
          </div>
          <CardDescription>
            Anti-fraud toolkit for e-commerce applications
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result && (
            <Alert className={
              result.status === 'allow' ? 'bg-green-50 text-green-800 border-green-200' : 
              result.status === 'review' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
              'bg-red-50 text-red-800 border-red-200'
            }>
              <AlertTitle className="flex items-center gap-2">
                {result.status === 'allow' ? (
                  <><CheckCircle className="h-4 w-4" /> Verification Successful</>
                ) : result.status === 'review' ? (
                  <><AlertTriangle className="h-4 w-4" /> Additional Verification Required</>
                ) : (
                  <><AlertTriangle className="h-4 w-4" /> Verification Failed</>
                )}
              </AlertTitle>
              <AlertDescription>
                <p className="mt-2">{result.message}</p>
                <p className="mt-2">Trust Score: {result.score}/100</p>
                <p className="mt-1 text-xs">Session ID: {result.sessionId}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <DeviceInfo />
            <UserBehavior />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Status: {isInitialized ? 'SDK Initialized' : 'Initializing...'}
          </div>
          <Button 
            onClick={verifyUser} 
            disabled={loading || !isInitialized}
          >
            {loading ? 'Verifying...' : 'Verify User'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NexFraudSDK;
