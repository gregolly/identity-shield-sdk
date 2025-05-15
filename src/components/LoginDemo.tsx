
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { verifyIdentity } from './NexFraudSDK/sdk';

interface LoginResult {
  status: 'allow' | 'review' | 'deny';
  score: number;
  message: string;
}

const LoginDemo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<LoginResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Simulating a regular login attempt
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Now check the risk using our SDK
      const verificationResult = await verifyIdentity();
      
      if (verificationResult.status === 'allow') {
        setResult({
          status: 'allow',
          score: verificationResult.score,
          message: 'Login successful! Welcome back.',
        });
      } else if (verificationResult.status === 'review') {
        setResult({
          status: 'review',
          score: verificationResult.score,
          message: 'Additional verification required. Please check your email for a security code.',
        });
      } else {
        setResult({
          status: 'deny',
          score: verificationResult.score,
          message: 'Login blocked due to suspicious activity. Please contact support.',
        });
      }
    } catch (err) {
      setError('Failed to process login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>NexShop Login</CardTitle>
          <CardDescription>
            Log in to your account to continue shopping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <><CheckCircle className="h-4 w-4" /> Login Successful</>
                ) : result.status === 'review' ? (
                  <><AlertTriangle className="h-4 w-4" /> Verification Required</>
                ) : (
                  <><AlertTriangle className="h-4 w-4" /> Login Blocked</>
                )}
              </AlertTitle>
              <AlertDescription>
                <p className="mt-2">{result.message}</p>
                <p className="mt-2 text-xs">Trust Score: {result.score}/100</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : 'Log in'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginDemo;
