
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Shield, Loader2, Clock, Monitor, MousePointer } from 'lucide-react';
import { initializeSimplifiedSDK, verifyIdentity } from './NexFraudSDK/simplifiedSdk';

const ShowcasePage = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'allow' | 'review' | 'deny';
    score: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Initialize the SDK
    initializeSimplifiedSDK();
    setInitialized(true);
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
        <Badge variant="outline" className={initialized ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
          {initialized ? "SDK Active" : "Initializing..."}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Intelligence
            </CardTitle>
            <CardDescription>Information collected about this device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {initialized && window.simplifiedNexFraud ? (
                <>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-medium">Fingerprint:</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {window.simplifiedNexFraud.data.device.fingerprint}
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-medium">Browser:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.device.browser}
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-medium">OS:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.device.os}
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-medium">Resolution:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.device.resolution}
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-medium">Timezone:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.device.timezone}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading device data...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              User Behavior
            </CardTitle>
            <CardDescription>Real-time behavior tracking metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {initialized && window.simplifiedNexFraud ? (
                <>
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Time on page:
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.behavior.timeOnPage} seconds
                    </div>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <div className="font-medium">Mouse movements:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.behavior.mouseMovements} tracked
                    </div>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <div className="font-medium">Clicks:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.behavior.clicks} detected
                    </div>
                  </div>
                  <div className="grid grid-cols-[130px_1fr] gap-2">
                    <div className="font-medium">Key presses:</div>
                    <div className="text-sm text-muted-foreground">
                      {window.simplifiedNexFraud.data.behavior.keyPresses} recorded
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Initializing behavior tracking...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Fraud Detection Demo</CardTitle>
          <CardDescription>
            Test the fraud detection capabilities of the NexFraud SDK
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
                Verifying...
              </>
            ) : 'Verify Identity'}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        NexFraud SDK Demo • Fraud detection for modern e-commerce
      </div>
    </div>
  );
};

export default ShowcasePage;
