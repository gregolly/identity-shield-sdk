import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Code, Server, Cpu, BookOpen, Package, Copy } from 'lucide-react';

const SDKDocumentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          NexFraud Documentation
        </CardTitle>
        <CardDescription>
          Integration guide and API reference for the NexFraud SDK
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="installation">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="installation" className="space-y-4">
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription className="flex items-center">
                <span className="flex-1">Install the NexFraud SDK packages for frontend and backend</span>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Frontend Package</h3>
                  <button 
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    onClick={() => copyToClipboard('npm install nexfraud-sdk-client')}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  npm install nexfraud-sdk-client
                </pre>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Backend Package</h3>
                  <button 
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    onClick={() => copyToClipboard('npm install nexfraud-sdk-server')}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  npm install nexfraud-sdk-server
                </pre>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Quick Start</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Install both packages using npm, yarn, or your preferred package manager</li>
                  <li>Initialize the client SDK in your frontend application</li>
                  <li>Set up the server SDK in your backend application</li>
                  <li>Configure risk rules and thresholds based on your security requirements</li>
                  <li>Implement verification checks at critical points (login, checkout, etc.)</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="frontend" className="space-y-4">
            <Alert>
              <Cpu className="h-4 w-4" />
              <AlertDescription>
                The frontend SDK collects device and behavior data without requiring user interaction
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Basic Implementation</h3>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`// Import the SDK
import { initializeSDK, verifyIdentity } from 'nexfraud-sdk-client';

// Initialize when your application loads
document.addEventListener('DOMContentLoaded', () => {
  initializeSDK();
});

// Verify user identity at critical points
async function handleLoginSubmit(e) {
  e.preventDefault();
  
  try {
    // Check user risk level before proceeding
    const result = await verifyIdentity();
    
    if (result.status === 'allow') {
      // Proceed with normal login
      submitLoginForm();
    } else if (result.status === 'review') {
      // Request additional verification
      showTwoFactorAuth();
    } else {
      // Block the action
      showBlockedMessage();
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Advanced Configuration</h3>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`// Custom initialization with options
initializeSDK({
  endpoint: 'https://your-api.example.com/verify',
  collectGeo: true,  // Enable geolocation collection (requires user consent)
  collectBehavior: true,  // Enable behavior tracking
  sessionTTL: 30,  // Session timeout in minutes
  debug: false  // Enable debug logging
});`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="backend" className="space-y-4">
            <Alert>
              <Server className="h-4 w-4" />
              <AlertDescription>
                The backend SDK processes client data and returns risk assessments
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Express.js Integration</h3>
                <ScrollArea className="h-[300px]">
                  <pre className="bg-muted p-3 rounded-md text-sm">
{`const express = require('express');
const { NexFraud } = require('nexfraud-sdk-server');
const app = express();

// Initialize the SDK with configuration
const nexFraud = new NexFraud({
  rules: {
    newDevice: true,
    suspiciousIp: true,
    anomalousBehavior: true,
    // ... other rules
  },
  thresholds: {
    allowThreshold: 75,
    reviewThreshold: 40,
  },
  customRules: [
    // Add your own custom rules
    {
      name: 'highValueTransaction',
      evaluate: (data, context) => {
        return context.transactionAmount > 1000 ? -20 : 0;
      }
    }
  ]
});

// Use as middleware for all routes
app.use(express.json());

// Create a dedicated verification endpoint
app.post('/api/identity/verify', async (req, res) => {
  try {
    const result = await nexFraud.verify(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protect specific routes with middleware
app.post('/api/checkout', nexFraud.protect(), (req, res) => {
  // If we get here, the user passed the verification
  // or needs additional verification
  const { status, score } = req.fraudCheck;
  
  if (status === 'review') {
    // Implement step-up authentication
    return res.json({ requiresAdditionalAuth: true });
  }
  
  // Normal checkout process
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Frontend SDK API</h3>
                <div className="space-y-4">
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium">initializeSDK(options?)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Initializes the SDK and begins collecting device and behavior data
                    </p>
                    <p className="text-xs mt-2 font-medium">Parameters:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li><code>options</code> (optional): Configuration options</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium">verifyIdentity()</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sends collected data to the backend and returns verification result
                    </p>
                    <p className="text-xs mt-2 font-medium">Returns:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li>Promise&lt;Result&gt;: Verification result with status and score</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Backend SDK API</h3>
                <div className="space-y-4">
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium">new NexFraud(config)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Creates a new instance of the NexFraud backend SDK
                    </p>
                    <p className="text-xs mt-2 font-medium">Parameters:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li><code>config</code>: Configuration options for rules and thresholds</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium">verify(data)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Analyzes client data and returns a risk assessment
                    </p>
                    <p className="text-xs mt-2 font-medium">Parameters:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li><code>data</code>: Client data payload from frontend SDK</li>
                    </ul>
                    <p className="text-xs mt-2 font-medium">Returns:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li>Promise&lt;Result&gt;: Assessment with status, score, and message</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md">
                    <h4 className="font-medium">protect(options?)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Middleware function for Express.js to protect routes
                    </p>
                    <p className="text-xs mt-2 font-medium">Parameters:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li><code>options</code> (optional): Additional protection options</li>
                    </ul>
                    <p className="text-xs mt-2 font-medium">Returns:</p>
                    <ul className="text-xs list-disc pl-5 mt-1">
                      <li>Express middleware function</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SDKDocumentation;
