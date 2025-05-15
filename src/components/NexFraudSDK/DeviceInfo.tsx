
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Laptop, Globe, Clock } from 'lucide-react';

const DeviceInfo = () => {
  // Access the nexFraudData from the window object
  const deviceData = window.nexFraudData?.device || {
    userAgent: 'Not available',
    screenResolution: 'Not available',
    platform: 'Not available',
    language: 'Not available',
    timezone: 'Not available',
    cpuCores: 'Not available',
    fingerprint: 'Not available',
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Laptop className="h-5 w-5" />
          Device Information
        </CardTitle>
        <CardDescription>Information collected about the current device</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[1fr_2fr] gap-1">
            <div className="font-medium">Platform:</div>
            <div className="text-muted-foreground">{deviceData.platform}</div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-1">
            <div className="font-medium">Resolution:</div>
            <div className="text-muted-foreground">{deviceData.screenResolution}</div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-1">
            <div className="font-medium">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Language:
              </span>
            </div>
            <div className="text-muted-foreground">{deviceData.language}</div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-1">
            <div className="font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Timezone:
              </span>
            </div>
            <div className="text-muted-foreground">{deviceData.timezone}</div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-1">
            <div className="font-medium">CPU Cores:</div>
            <div className="text-muted-foreground">{deviceData.cpuCores}</div>
          </div>
          <div className="pt-2 text-xs text-muted-foreground border-t">
            Fingerprint ID: {deviceData.fingerprint ? `${deviceData.fingerprint.substring(0, 12)}...` : 'Not available'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceInfo;
