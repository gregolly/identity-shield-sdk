import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, InfoIcon } from 'lucide-react';
import NexFraudSDK from '@/components/NexFraudSDK';
import LoginDemo from '@/components/LoginDemo';
import BackendDemo from '@/components/BackendDemo';
import SDKDocumentation from '@/components/SDKDocumentation';
import MockAPI from '@/components/MockAPI';
import { NexFraudData } from '@/components/NexFraudSDK/sdk';

// Extend the Window interface using the proper type from the SDK file
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

const Index = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulating SDK initialization delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock API for demonstration purposes */}
      <MockAPI />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">NexFraud SDK</h1>
          </div>
          <div className="text-sm text-gray-500">
            Anti-fraud toolkit for e-commerce
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>SDK Demo</AlertTitle>
          <AlertDescription>
            This page demonstrates the NexFraud SDK for fraud detection in e-commerce applications.
            The SDK collects device fingerprinting and behavior data to assess risk level.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="sdk" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="sdk">SDK Demo</TabsTrigger>
            <TabsTrigger value="login">Login Demo</TabsTrigger>
            <TabsTrigger value="backend">Backend Config</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sdk">
            <NexFraudSDK />
          </TabsContent>
          
          <TabsContent value="login">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">NexShop Secure Login</h2>
                <p className="text-gray-600">
                  This demo shows how NexFraud SDK integrates with a login form to prevent fraud
                </p>
              </div>
              <LoginDemo />
            </div>
          </TabsContent>
          
          <TabsContent value="backend">
            <div className="max-w-4xl mx-auto">
              <BackendDemo />
            </div>
          </TabsContent>
          
          <TabsContent value="docs">
            <div className="max-w-4xl mx-auto">
              <SDKDocumentation />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; 2025 NexFraud SDK · An anti-fraud solution for e-commerce
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
