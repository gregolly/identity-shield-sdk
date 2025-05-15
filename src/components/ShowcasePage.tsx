
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Shield, Loader2, Lock, Fingerprint, Database } from 'lucide-react';
import { initializeSimplifiedSDK, verifyIdentity, SimplifiedNexFraudData } from './NexFraudSDK/simplifiedSdk';
import { Link } from 'react-router-dom';

const ShowcasePage = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceData, setDeviceData] = useState<SimplifiedNexFraudData['device'] | null>(null);
  const [behaviorData, setbehaviorData] = useState<SimplifiedNexFraudData['behavior'] | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'allow' | 'review' | 'deny';
    score: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Initialize the SDK
    initializeSimplifiedSDK();
    setInitialized(true);
    
    // Set initial device data
    if (window.simplifiedNexFraud) {
      setDeviceData(window.simplifiedNexFraud.data.device);
    }
    
    // Update behavior data every second
    const intervalId = setInterval(() => {
      if (window.simplifiedNexFraud) {
        setbehaviorData({...window.simplifiedNexFraud.data.behavior});
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await verifyIdentity();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">NexFraud SDK</h1>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className={initialized ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
            {initialized ? "SDK Active" : "Initializing..."}
          </Badge>
          <Link to="/full-demo">
            <Button variant="outline" size="sm">Full Demo</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              NexFraud SDK Showcase
            </CardTitle>
            <CardDescription>
              Lightweight, non-invasive fraud detection for modern web applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50">
                <Fingerprint className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Non-invasive Collection</h3>
                <p className="text-sm text-muted-foreground">Passively collects device and behavior signals</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50">
                <Lock className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Simple Integration</h3>
                <p className="text-sm text-muted-foreground">One line to initialize, verify with a single API call</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50">
                <Database className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Structured Results</h3>
                <p className="text-sm text-muted-foreground">Clear status and risk score to guide decisions</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Device Fingerprint</h3>
                <div className="space-y-2 text-sm">
                  {deviceData ? (
                    <>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <div className="font-medium">Browser:</div>
                        <div className="text-muted-foreground">{deviceData.browser}</div>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <div className="font-medium">OS:</div>
                        <div className="text-muted-foreground">{deviceData.os}</div>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <div className="font-medium">Resolution:</div>
                        <div className="text-muted-foreground">{deviceData.resolution}</div>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-1">
                        <div className="font-medium">Timezone:</div>
                        <div className="text-muted-foreground">{deviceData.timezone}</div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">User Behavior</h3>
                <div className="space-y-2 text-sm">
                  {behaviorData ? (
                    <>
                      <div className="grid grid-cols-[120px_1fr] gap-1">
                        <div className="font-medium">Time on page:</div>
                        <div className="text-muted-foreground">{behaviorData.timeOnPage} seconds</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-1">
                        <div className="font-medium">Mouse movements:</div>
                        <div className="text-muted-foreground">{behaviorData.mouseMovements}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-1">
                        <div className="font-medium">Clicks:</div>
                        <div className="text-muted-foreground">{behaviorData.clicks}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-1">
                        <div className="font-medium">Key presses:</div>
                        <div className="text-muted-foreground">{behaviorData.keyPresses}</div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Verify Identity</CardTitle>
            <CardDescription>
              Test the verification with data collected passively in the background
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationResult && (
              <Alert className={
                verificationResult.status === 'allow' ? 'bg-green-50 text-green-800 border-green-200' : 
                verificationResult.status === 'review' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                'bg-red-50 text-red-800 border-red-200'
              }>
                <AlertTitle className="flex items-center gap-2">
                  {verificationResult.status === 'allow' ? (
                    <><Check className="h-4 w-4" /> Verification Successful</>
                  ) : verificationResult.status === 'review' ? (
                    <><AlertTriangle className="h-4 w-4" /> Additional Verification Required</>
                  ) : (
                    <><AlertTriangle className="h-4 w-4" /> Verification Failed</>
                  )}
                </AlertTitle>
                <AlertDescription>
                  <p className="mt-1">{verificationResult.message}</p>
                  <p className="mt-2">Trust Score: {verificationResult.score}/100</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleVerify} 
              disabled={loading || !initialized}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : 'Verify Identity'}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>NexFraud SDK - Lightweight fraud detection for modern applications</p>
          <p className="text-xs">Integration: <code>initializeSimplifiedSDK()</code> • Verification: <code>await verifyIdentity()</code></p>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;
