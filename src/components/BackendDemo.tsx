import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Settings, Code, BarChart, Save } from 'lucide-react';

const BackendDemo = () => {
  const [selectedRules, setSelectedRules] = useState({
    newDevice: true,
    ipGeolocation: true,
    tooFastNavigation: true,
    unusualUserBehavior: true,
    emptyUserBehavior: true,
    browserSpoofing: true,
    highRiskCountry: true,
  });
  
  const [thresholds, setThresholds] = useState({
    allowThreshold: 75,
    reviewThreshold: 40,
  });
  
  const handleRuleToggle = (ruleName: string) => {
    setSelectedRules(prev => ({
      ...prev,
      [ruleName]: !prev[ruleName as keyof typeof prev],
    }));
  };
  
  const handleThresholdChange = (name: string, value: number[]) => {
    setThresholds(prev => ({
      ...prev,
      [name]: value[0],
    }));
  };
  
  const mockRiskRules = [
    { id: 'newDevice', name: 'New Device Detection', impact: 'high' },
    { id: 'ipGeolocation', name: 'Suspicious IP/Geolocation', impact: 'high' },
    { id: 'tooFastNavigation', name: 'Unrealistic Navigation Speed', impact: 'medium' },
    { id: 'unusualUserBehavior', name: 'Unusual User Behavior Pattern', impact: 'medium' },
    { id: 'emptyUserBehavior', name: 'Empty User Behavior Data', impact: 'medium' },
    { id: 'browserSpoofing', name: 'Browser Fingerprint Spoofing', impact: 'high' },
    { id: 'highRiskCountry', name: 'Connection from High-Risk Country', impact: 'medium' },
  ];
  
  const backendCodeExample = `
// NexFraud SDK Backend Integration Example
const express = require('express');
const app = express();
const { NexFraud } = require('nexfraud-sdk');

// Initialize the SDK with your configuration
const nexFraud = new NexFraud({
  rules: {
    newDevice: true,
    ipGeolocation: true,
    tooFastNavigation: true,
    unusualUserBehavior: true,
    emptyUserBehavior: true,
    browserSpoofing: true,
    highRiskCountry: true,
  },
  thresholds: {
    allowThreshold: 75,  // Score >= 75: allow the action
    reviewThreshold: 40, // Score >= 40: require additional verification
    // Below 40: deny the action
  },
  // Optional custom handlers
  handlers: {
    onHighRisk: async (data) => {
      // Log to your security system or notify team
      console.log('High risk activity detected:', data);
    }
  }
});

// Use as middleware (applies to all routes)
app.use(express.json());

// Dedicated verification endpoint
app.post('/api/identity/verify', async (req, res) => {
  try {
    const clientData = req.body;
    const result = await nexFraud.verify(clientData);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Verification failed',
      message: error.message 
    });
  }
});

// Protect specific routes
app.post('/api/checkout', nexFraud.protect(), (req, res) => {
  // If code reaches here, verification passed or needs review
  // For 'review' status, you might want to implement step-up auth
  const { status } = req.fraudCheck;
  
  if (status === 'review') {
    // Implement additional verification
    return res.json({ 
      requiresAdditionalVerification: true,
      // ...other data
    });
  }
  
  // Normal checkout process continues
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
  `;
  
  const frontendCodeExample = `
// NexFraud SDK Frontend Integration Example
import { initializeSDK, verifyIdentity } from 'nexfraud-sdk';

// Initialize the SDK when your app loads
// This begins passive data collection
document.addEventListener('DOMContentLoaded', () => {
  initializeSDK();
});

// Example login form submit handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    // First, verify the user identity with the SDK
    const verificationResult = await verifyIdentity();
    
    // Check verification status
    if (verificationResult.status === 'deny') {
      // Block the login attempt
      showError('Login blocked due to security concerns');
      return;
    }
    
    if (verificationResult.status === 'review') {
      // Require additional verification
      redirectToTwoFactorAuth(email, verificationResult.sessionId);
      return;
    }
    
    // Normal login flow continues
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    // Handle login response
    // ...
  } catch (error) {
    showError('An error occurred during login');
    console.error(error);
  }
});
  `;
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          NexFraud SDK Backend Configuration
        </CardTitle>
        <CardDescription>
          Configure the risk assessment engine and view integration examples
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rules">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="rules">Risk Rules</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="code">Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable or disable risk assessment rules used by the backend engine:
            </p>
            
            <div className="grid gap-4">
              {mockRiskRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={rule.id} 
                      checked={selectedRules[rule.id as keyof typeof selectedRules]} 
                      onCheckedChange={() => handleRuleToggle(rule.id)}
                    />
                    <div>
                      <Label htmlFor={rule.id} className="font-medium">{rule.name}</Label>
                      <Badge variant={rule.impact === 'high' ? 'destructive' : 'outline'} className="ml-2">
                        {rule.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="thresholds" className="space-y-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Allow Threshold ({thresholds.allowThreshold})</h3>
                    <p className="text-sm text-muted-foreground">
                      Scores at or above this value will pass verification
                    </p>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">{thresholds.allowThreshold}</Badge>
                </div>
                <Slider 
                  value={[thresholds.allowThreshold]} 
                  min={50} 
                  max={95} 
                  step={5}
                  onValueChange={(value) => handleThresholdChange('allowThreshold', value)}
                />
              </div>
              
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Review Threshold ({thresholds.reviewThreshold})</h3>
                    <p className="text-sm text-muted-foreground">
                      Scores below Allow but above this value require additional verification
                    </p>
                  </div>
                  <Badge className="bg-amber-500 hover:bg-amber-600">{thresholds.reviewThreshold}</Badge>
                </div>
                <Slider 
                  value={[thresholds.reviewThreshold]} 
                  min={20} 
                  max={65} 
                  step={5}
                  onValueChange={(value) => handleThresholdChange('reviewThreshold', value)}
                />
              </div>
              
              <div className="mt-4 rounded-md bg-muted p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm">
                    Scores below {thresholds.reviewThreshold} will be denied automatically
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <Tabs defaultValue="backend">
              <TabsList className="mb-4">
                <TabsTrigger value="backend" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  Backend
                </TabsTrigger>
                <TabsTrigger value="frontend" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  Frontend
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="backend">
                <p className="text-sm text-muted-foreground mb-2">
                  Express.js integration example:
                </p>
                <ScrollArea className="h-[400px] rounded-md border bg-muted p-4">
                  <pre className="text-xs font-mono">{backendCodeExample}</pre>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="frontend">
                <p className="text-sm text-muted-foreground mb-2">
                  Frontend integration example:
                </p>
                <ScrollArea className="h-[400px] rounded-md border bg-muted p-4">
                  <pre className="text-xs font-mono">{frontendCodeExample}</pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BackendDemo;
